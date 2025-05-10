import { useState } from "react";
import { Box, useTheme, useMediaQuery, Drawer, Typography } from "@mui/material";
import RepoCard from "@/components/RepoCard";
import RepoDetails from "@/components/RepoDetails";
import { Repository } from "@/types";

interface RepoSectionProps {
  repos: Repository[];
  onDelete: (id: number) => void;
  onCardClick: (repoId: string, releaseId?: string) => void;
}

export default function RepoSection({ repos, onDelete, onCardClick }: RepoSectionProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRepo = repos.find((r) => r.id === selectedId) ?? null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = (repoId: number, releaseId?: number) => {
    setSelectedId(repoId);
    onCardClick(repoId.toString(), releaseId?.toString());
  };

  const handleCloseDetails = () => {
    setSelectedId(null);
  };

  const handleDelete = (repoId: number) => {
    onDelete(repoId);
    if (selectedRepo?.id === repoId) {
      setSelectedId(null);
    }
  };

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
              onSelect={() => handleSelect(repo.id, repo.latestRelease?.id)}
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
