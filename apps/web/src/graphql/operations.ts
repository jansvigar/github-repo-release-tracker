import { gql } from "@apollo/client";

export const GET_REPOS = gql`
  query GetRepos {
    trackedRepositories {
      id
      owner
      name
      seen
      latestRelease {
        id
        tagName
        publishedAt
        htmlUrl
        body
        seen
      }
    }
  }
`;

export const ADD_REPO = gql`
  mutation AddRepo($url: String!) {
    addRepository(url: $url) {
      id
      owner
      name
    }
  }
`;

export const DELETE_REPO = gql`
  mutation DeleteRepo($id: ID!) {
    deleteRepository(id: $id) {
      id
    }
  }
`;

export const MARK_SEEN = gql`
  mutation MarkSeen($releaseId: ID!) {
    markReleaseSeen(releaseId: $releaseId) {
      id
      seen
    }
  }
`;

export const REFRESH_REPO = gql`
  mutation RefreshRepo($id: ID!) {
    refreshRepo(id: $id) {
      id
      owner
      name
      unseen
      latestRelease {
        id
        tagName
        publishedAt
        htmlUrl
        body
        seen
      }
    }
  }
`;
