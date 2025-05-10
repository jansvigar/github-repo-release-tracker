export const schema = `
scalar DateTime  

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
    publishedAt: DateTime!
    htmlUrl: String!
    body: String!
    seen: Boolean!
  }

  type Query {
    trackedRepositories: [TrackedRepository!]!
  }

  type Mutation {
    addRepository(url: String!): TrackedRepository!
    deleteRepository(id: ID!): TrackedRepository!
    markReleaseSeen(releaseId: ID!): Release!
    refreshRepo(id: ID!): TrackedRepository!
  }
`;
