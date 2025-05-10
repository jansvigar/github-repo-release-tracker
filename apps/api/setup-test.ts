import { vi } from "vitest";

vi.mock("../db/client", () => {
  const fakeDb = {
    query: {
      repositories: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn() },
      releases: { findFirst: vi.fn().mockResolvedValue(null) },
    },
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnValue([{ id: 1 }]),
  };
  return { db: fakeDb };
});

vi.mock("@octokit/rest", () => {
  return {
    Octokit: vi.fn().mockImplementation(() => ({
      repos: {
        getLatestRelease: vi.fn().mockResolvedValue({
          data: {
            tag_name: "v1.2.3",
            published_at: new Date().toISOString(),
            html_url: "https://github.com/user/repo/releases/tag/v1.2.3",
          },
        }),
      },
    })),
  };
});
