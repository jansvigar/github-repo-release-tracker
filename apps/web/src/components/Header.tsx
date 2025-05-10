import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" component="h1">
          GitHub Release Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
