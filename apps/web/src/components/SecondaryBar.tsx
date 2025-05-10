import { FormEvent, useState } from "react";
import { Card, CardContent, Box, TextField, Button, Divider } from "@mui/material";

interface SecondaryBarProps {
  onSubmit: (url: string) => void;
  onRefreshAll: () => void;
}

export default function SecondaryBar({ onSubmit, onRefreshAll }: SecondaryBarProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
    setUrl("");
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            label="Enter repo to track"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            fullWidth
            size="small"
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ ml: 1 }}>
            Add
          </Button>

          <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 32 }} />

          <Button type="button" variant="outlined" color="primary" onClick={onRefreshAll}>
            Refresh
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
