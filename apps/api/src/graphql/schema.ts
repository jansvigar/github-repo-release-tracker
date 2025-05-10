export const schema = `
  type TrackedRepository {
    id: ID!
    owner: String!
    name: String!
    latestRelease: Release
    seen: Boolean!
  }

  type Release {
    id: ID!
    tagName: String!
    publishedAt: String!
    htmlUrl: String!
    seen: Boolean!
  }

  type Query {
    trackedRepositories: [TrackedRepository!]!
  }

  type Mutation {
    addRepository(url: String!): TrackedRepository!
    markReleaseSeen(releaseId: ID!): Release!
    refreshRepo(id: ID!): TrackedRepository!
  }
`;
