import { Card, Chip, CardContent, Typography, Skeleton, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

interface RepoCardProps {
  repoName: string;
  tagName: string;
  publishedDate: string;
  isNew: boolean;
  selected: boolean;
  isLoading?: boolean;
  onSelect: () => void;
  onMarkAsSeen: () => void;
  onDelete: () => void;
}

export default function RepoCard({
  repoName,
  tagName,
  publishedDate,
  isNew,
  selected,
  isLoading = false,
  onSelect,
  onMarkAsSeen,
  onDelete,
}: RepoCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isLoading) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={isLoading ? -1 : 0}
      onClick={() => !isLoading && onSelect()}
      onKeyDown={handleKeyDown}
      sx={{
        position: "relative",
        mb: 2,
        cursor: isLoading ? "default" : "pointer",
        pointerEvents: isLoading ? "none" : "auto",
        border: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
        boxShadow: selected ? 4 : 1,
        transition: "all 0.2s",
        opacity: isLoading ? 0.7 : 1,
        outline: selected ? "2px solid" : "none",
        "&:focus": {
          outline: "2px solid",
          outlineColor: "primary.main",
        },
      }}
    >
      {isNew && !isLoading && (
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

        {isLoading ? (
          <>
            <Skeleton width="40%" variant="text" sx={{ mt: 0.5 }} />
            <Skeleton width="30%" variant="text" sx={{ mt: 0.25 }} />
          </>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ mt: 0.5, fontStyle: "italic" }}>
              {tagName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25 }}
            >
              {new Date(publishedDate).toLocaleDateString()}
            </Typography>
          </>
        )}
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
        {isLoading ? (
          <>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </>
        ) : (
          <>
            {isNew && (
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsSeen();
                }}
                aria-label="Mark as seen"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            )}
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
          </>
        )}
      </Box>
    </Card>
  );
}
