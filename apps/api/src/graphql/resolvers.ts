import { IResolvers } from "mercurius";
import db from "../db/client.js";
import { trackedRepositories, releases } from "../db/schema.js";
import { Octokit } from "@octokit/rest";
import { desc, eq } from "drizzle-orm";

const octo = new Octokit({ auth: process.env.GITHUB_PAT });

async function fetchLatest(owner: string, repo: string) {
  const { data } = await octo.repos.getLatestRelease({ owner, repo });
  return {
    tagName: data.tag_name,
    publishedAt: data.published_at ? new Date(data.published_at) : null,
    htmlUrl: data.html_url,
  };
}

export const resolvers: IResolvers = {
  Query: {
    trackedRepositories: () => db.select().from(trackedRepositories),
  },

  Mutation: {
    addRepository: async (_, { url }: { url: string }) => {
      const [, owner, name] = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/?$)/)!;
      const [repo] = await db
        .insert(trackedRepositories)
        .values({ owner, name })
        .onConflictDoNothing()
        .returning();
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

    refreshRepo: async (_, { id }: { id: number }) => {
      const repo = await db.query.trackedRepositories.findFirst({
        where: eq(trackedRepositories.id, id),
      });
      if (!repo) throw new Error("Repo not found");

      const latest = await fetchLatest(repo.owner, repo.name);

      await db
        .insert(releases)
        .values({ repositoryId: repo.id, ...latest })
        .onConflictDoNothing()
        .returning();

      return repo;
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
