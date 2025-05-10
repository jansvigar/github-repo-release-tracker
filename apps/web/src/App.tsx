import { Container } from "@mui/material";
import Header from "@/components/Header";
import SecondaryBar from "@/components/SecondaryBar";
import RepoSection from "@/components/RepoSection";

function App() {
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
      <SecondaryBar
        onSubmit={(url) => {
          console.log("URL submitted:", url);
        }}
        onRefreshAll={() => {
          console.log("Refresh all clicked");
        }}
      />
      <RepoSection />
    </Container>
  );
}

export default App;
