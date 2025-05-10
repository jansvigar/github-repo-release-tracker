import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { mockDb } from "../mocks/db.js";
import Fastify from "fastify";
import mercurius from "mercurius";

vi.mock("../db/client.js", () => ({
  default: mockDb,
}));

vi.mock("@octokit/rest", () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    repos: {
      getLatestRelease: vi.fn().mockResolvedValue({
        data: {
          tag_name: "v9.9.9",
          published_at: new Date("2024-01-01").toISOString(),
          html_url: "https://example.com/release",
        },
      }),
    },
  })),
}));

import { schema } from "../graphql/schema.js";
import { resolvers } from "../graphql/resolvers.js";

let app: ReturnType<typeof Fastify>;

beforeAll(async () => {
  app = Fastify({ logger: false });
  await app.register(mercurius, {
    schema,
    resolvers,
    graphiql: false,
    subscription: false,
  });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /graphql", () => {
  test("Query trackedRepositories returns empty list", async () => {
    const from = vi.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from });

    const res = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: { query: "{ trackedRepositories { id owner name } }" },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data).toEqual({ trackedRepositories: [] });
    expect(mockDb.select).toHaveBeenCalled();
    expect(from).toHaveBeenCalledWith(expect.any(Object));
  });
});

test("Mutation addRepository returns inserted repo", async () => {
  const values = vi.fn().mockReturnThis();
  const onConflictDoNothing = vi.fn().mockReturnThis();
  const returning = vi.fn().mockResolvedValue([{ id: 123, owner: "foo", name: "bar" }]);
  mockDb.insert.mockReturnValue({ values, onConflictDoNothing, returning });

  const res = await app.inject({
    method: "POST",
    url: "/graphql",
    payload: {
      query: `
          mutation AddRepo($url: String!) {
            addRepository(url: $url) {
              id
              owner
              name
            }
          }
        `,
      variables: { url: "https://github.com/foo/bar" },
    },
  });

  expect(res.statusCode).toBe(200);
  const body = res.json();
  expect(body.errors).toBeUndefined();
  expect(body.data).toEqual({
    addRepository: { id: "123", owner: "foo", name: "bar" },
  });

  expect(mockDb.insert).toHaveBeenCalledWith(expect.any(Object));
  expect(values).toHaveBeenCalledWith({ owner: "foo", name: "bar" });
  expect(onConflictDoNothing).toHaveBeenCalled();
  expect(returning).toHaveBeenCalled();
});
