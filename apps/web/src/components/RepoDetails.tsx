import { Repository } from "@/types";
import { Card, CardContent, Typography, Link, Stack, Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RepoDetailsProps {
  repo: Repository | null;
}

export default function RepoDetails({ repo }: RepoDetailsProps) {
  if (!repo) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Select a repository to view details
      </Typography>
    );
  }
  const rel = repo.latestRelease;
  if (!rel) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No releases for {repo.owner}/{repo.name}
      </Typography>
    );
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <CardContent sx={{ flex: 1, overflowY: "auto" }}>
        <Stack spacing={1}>
          <Typography variant="h5">
            {repo.owner}/{repo.name}
          </Typography>
          <Typography variant="subtitle1">{rel.tagName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(rel.publishedAt).toLocaleDateString()}
          </Typography>
          <Link href={rel.htmlUrl} target="_blank" rel="noopener">
            View on GitHub
          </Link>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {rel.body || "No description available."}
          </ReactMarkdown>
        </Box>
      </CardContent>
    </Card>
  );
}
