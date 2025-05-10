import { IResolvers } from "mercurius";
import db from "../db/client.js";
import { trackedRepositories, releases } from "../db/schema.js";
import { Octokit } from "@octokit/rest";
import { and, desc, eq } from "drizzle-orm";

const octo = new Octokit({ auth: process.env.GITHUB_PAT });

async function fetchLatest(owner: string, repo: string) {
  const { data } = await octo.repos.getLatestRelease({ owner, repo });
  return {
    tagName: data.tag_name,
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    htmlUrl: data.html_url,
    body: data.body ?? "",
  };
}

export const resolvers: IResolvers = {
  Query: {
    trackedRepositories: () => db.select().from(trackedRepositories),
  },

  Mutation: {
    addRepository: async (_ctx, { url }: { url: string }) => {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/?$)/);
      if (!match) {
        throw new Error("Invalid GitHub URL. Expected format: https://github.com/<owner>/<repo>");
      }
      const [, owner, name] = match;

      let latest;
      try {
        latest = await fetchLatest(owner, name);
      } catch (err) {
        throw new Error(
          `Could not fetch latest release: ${err instanceof Error ? err.message : err}`,
        );
      }

      const [inserted] = await db
        .insert(trackedRepositories)
        .values({ owner, name })
        .onConflictDoNothing()
        .returning();

      let repo;
      if (inserted) {
        repo = inserted;
      } else {
        const existing = await db.query.trackedRepositories.findFirst({
          where: and(eq(trackedRepositories.owner, owner), eq(trackedRepositories.name, name)),
        });
        if (!existing) {
          throw new Error("Failed to add or find repository");
        }
        repo = existing;
      }

      await db
        .insert(releases)
        .values({ repositoryId: repo.id, ...latest })
        .onConflictDoNothing({
          target: [releases.repositoryId, releases.tagName],
        });

      return repo;
    },

    deleteRepository: async (_ctx, { id }: { id: number }) => {
      const repo = await db.query.trackedRepositories.findFirst({
        where: eq(trackedRepositories.id, id),
      });
      if (!repo) {
        throw new Error(`Repository with id=${id} not found`);
      }

      await db.delete(releases).where(eq(releases.repositoryId, id));

      await db.delete(trackedRepositories).where(eq(trackedRepositories.id, id));

      return repo;
    },

    markReleaseSeen: async (_, { releaseId }: { releaseId: number }) => {
      const [row] = await db
        .update(releases)
        .set({ seen: true })
        .where(eq(releases.id, releaseId))
        .returning();
      return row;
    },

    refreshAllRepos: async () => {
      const repos = await db.query.trackedRepositories.findMany();

      await Promise.all(
        repos.map(async (repo) => {
          const latest = await fetchLatest(repo.owner, repo.name);
          await db
            .insert(releases)
            .values({ repositoryId: repo.id, ...latest })
            .onConflictDoNothing({
              target: [releases.repositoryId, releases.tagName],
            });
        }),
      );

      return repos;
    },
  },

  TrackedRepository: {
    latestRelease: (parent) =>
      db.query.releases.findFirst({
        where: eq(releases.repositoryId, parent.id),
        orderBy: [desc(releases.publishedAt)],
      }),

    seen: async (parent) => {
      const latest = await db.query.releases.findFirst({
        where: eq(releases.repositoryId, parent.id),
        orderBy: [desc(releases.publishedAt)],
      });
      return latest ? latest.seen : false;
    },
  },
};
