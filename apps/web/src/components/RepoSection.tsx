import { useState, useCallback, useMemo } from "react";
import { Box, useTheme, useMediaQuery, Drawer, Typography } from "@mui/material";
import RepoCard from "@/components/RepoCard";
import RepoDetails from "@/components/RepoDetails";

interface Repo {
  id: number;
  owner: string;
  name: string;
  seen: boolean;
  latestRelease: {
    id: number;
    htmlUrl: string;
    tagName: string;
    publishedAt: string;
    body?: string;
    seen: boolean;
  } | null;
}

export default function RepoSection() {
  const repos: Repo[] = useMemo(
    () => [
      {
        id: 1,
        owner: "vercel",
        name: "next.js",
        seen: false,
        latestRelease: {
          id: 1,
          htmlUrl: "https://github.com/vercel/next.js/releases/tag/v12.3.4",
          tagName: "v12.3.4",
          seen: false,
          publishedAt: "2025-05-10T12:34:56Z",
        },
      },
      {
        id: 2,
        owner: "facebook",
        name: "react",
        seen: true,
        latestRelease: {
          id: 2,
          htmlUrl: "https://github.com/facebook/react/releases/tag/v19.3.4",
          tagName: "v19.3.4",
          seen: true,
          publishedAt: "2025-02-01T12:34:56Z",
        },
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRepo = useMemo(
    () => repos.find((r) => r.id === selectedId) ?? null,
    [repos, selectedId],
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleMarkSeen = useCallback((repoId: number, releaseId: number) => {
    console.log("mark seen", repoId, releaseId);
  }, []);

  const handleDelete = useCallback(
    (repoId: number) => {
      console.log("delete", repoId);
      if (repoId === selectedId) setSelectedId(null);
    },
    [selectedId],
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        gap: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: 340,
          },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {repos.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 2, px: 2 }}>
              No repositories tracked.
            </Typography>
          )}
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repoName={`${repo.owner}/${repo.name}`}
              tagName={repo.latestRelease?.tagName ?? ""}
              publishedDate={repo.latestRelease ? repo.latestRelease.publishedAt : ""}
              isNew={!repo.seen}
              selected={repo.id === selectedId}
              isLoading={false}
              onSelect={() => handleSelect(repo.id)}
              onMarkAsSeen={() =>
                repo.latestRelease && handleMarkSeen(repo.id, repo.latestRelease.id)
              }
              onDelete={() => handleDelete(repo.id)}
            />
          ))}
        </Box>
      </Box>

      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          <RepoDetails repo={selectedRepo} />
        </Box>
      )}

      {isMobile && (
        <Drawer
          anchor="bottom"
          open={Boolean(selectedRepo)}
          onClose={handleCloseDetails}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: {
              sx: { height: "80%", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
            },
          }}
        >
          <Box
            sx={{ p: 2, height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              <RepoDetails repo={selectedRepo} />
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
