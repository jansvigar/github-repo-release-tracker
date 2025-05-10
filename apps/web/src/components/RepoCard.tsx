import React from "react";
import { Card, Chip, CardContent, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface RepoCardProps {
  repoName: string;
  tagName: string;
  publishedDate: string;
  isNew: boolean;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function RepoCard({
  repoName,
  tagName,
  publishedDate,
  isNew,
  selected,
  onSelect,
  onDelete,
}: RepoCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      sx={{
        position: "relative",
        mb: 2,
        cursor: "pointer",
        border: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
        boxShadow: selected ? 4 : 1,
        transition: "all 0.2s",
        outline: selected ? "2px solid" : "none",
        "&:focus": {
          outline: "2px solid",
          outlineColor: "primary.main",
        },
      }}
    >
      {isNew && (
        <Chip
          label="NEW"
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ pb: 6 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: "1rem" }}>
          {repoName}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 0.5, fontStyle: "italic" }}>
          {tagName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
          {new Date(publishedDate).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete repository"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
