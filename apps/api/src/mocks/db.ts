import { vi } from "vitest";

export const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  query: {
    trackedRepositories: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    releases: {
      findFirst: vi.fn(),
    },
  },
};
