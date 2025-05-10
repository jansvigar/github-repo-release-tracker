import { createTheme, ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";

export const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};
