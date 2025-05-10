export interface Repository {
  id: number;
  owner: string;
  name: string;
  seen: boolean;
  latestRelease: {
    id: number;
    tagName: string;
    publishedAt: string;
    htmlUrl: string;
    body: string;
    seen: boolean;
  } | null;
}

export interface GetReposData {
  trackedRepositories: Repository[];
}

export type GetReposVars = object;

export interface AddRepoData {
  addRepository: {
    id: string;
    owner: string;
    name: string;
  };
}

export interface AddRepoVars {
  url: string;
}

export interface DeleteRepoData {
  deleteRepository: {
    id: string;
  };
}

export interface DeleteRepoVars {
  id: string;
}

export interface MarkSeenData {
  markReleaseSeen: {
    id: string;
    seen: boolean;
  };
}

export interface MarkSeenVars {
  releaseId: string;
}

export interface RefreshAllData {
  refreshAllRepos: Repository[];
}

export type RefreshAllVars = object;
