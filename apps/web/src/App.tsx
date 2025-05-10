import { Alert, Container } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";

import Header from "@/components/Header";
import SecondaryBar from "@/components/SecondaryBar";
import RepoSection from "@/components/RepoSection";
import {
  ADD_REPO,
  DELETE_REPO,
  GET_REPOS,
  MARK_SEEN,
  REFRESH_ALL_REPOS,
} from "@/graphql/operations";
import {
  AddRepoData,
  AddRepoVars,
  DeleteRepoData,
  DeleteRepoVars,
  GetReposData,
  GetReposVars,
  MarkSeenData,
  MarkSeenVars,
  RefreshAllData,
  RefreshAllVars,
} from "./types";

function App() {
  const { data, error: getReposError, refetch } = useQuery<GetReposData, GetReposVars>(GET_REPOS);
  const [addRepo, { error: addError }] = useMutation<AddRepoData, AddRepoVars>(ADD_REPO, {
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteRepo, { error: deleteError }] = useMutation<DeleteRepoData, DeleteRepoVars>(
    DELETE_REPO,
    {
      onCompleted: () => refetch(),
    },
  );

  const [markSeen, { error: markSeenError }] = useMutation<MarkSeenData, MarkSeenVars>(MARK_SEEN, {
    onCompleted: () => refetch(),
  });

  const [refreshAllRepos, { error: refreshError }] = useMutation<RefreshAllData, RefreshAllVars>(
    REFRESH_ALL_REPOS,
    {
      // update cache instead of refetching
      update(cache, { data }) {
        if (!data) return;
        cache.writeQuery<GetReposData, GetReposVars>({
          query: GET_REPOS,
          data: { trackedRepositories: data.refreshAllRepos },
        });
      },
    },
  );

  const repos = data?.trackedRepositories || [];

  const sortedRepos = [...repos].sort((a, b) => {
    const aDate = a.latestRelease ? new Date(a.latestRelease.publishedAt).getTime() : 0;
    const bDate = b.latestRelease ? new Date(b.latestRelease.publishedAt).getTime() : 0;
    return bDate - aDate;
  });

  const hasError = getReposError || addError || deleteError || markSeenError || refreshError;
  const errorMessage = hasError
    ? (getReposError || addError || deleteError || markSeenError || refreshError)?.message
    : null;

  const handleAdd = (url: string) => {
    addRepo({ variables: { url } });
  };

  const handleDelete = (id: number) => {
    deleteRepo({ variables: { id: id.toString() } });
  };

  const handleCardClick = (repoId: string, releaseId?: string) => {
    if (!releaseId) return;
    markSeen({ variables: { releaseId } });
  };

  const handleRefreshAll = () => {
    refreshAllRepos();
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        maxWidth: 1200,
        width: "100%",
        mt: 2,
        mb: 4,
        px: 2,
      }}
    >
      <Header />
      <SecondaryBar onSubmit={handleAdd} onRefreshAll={handleRefreshAll} />
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <RepoSection repos={sortedRepos} onDelete={handleDelete} onCardClick={handleCardClick} />
    </Container>
  );
}

export default App;
