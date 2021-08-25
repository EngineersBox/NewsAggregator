import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme";
import "./App.css";
import TopBar from "./TopBar";
import Search from "./Search";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Grow from "@material-ui/core/Grow";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Grow in={true} timeout={1600}>
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          direction="row"
          spacing={3}
        >
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="h4" component="h2" gutterBottom>
              Using Open Source Technologies to Create a Search Engine
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="h5" component="h2" gutterBottom>
              NewsAggregator used Elastic Search, Redis and Rust in the backend,
              and React and Material UI for the frontend.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Search />
          </Grid>
        </Grid>
      </Grow>
    </ThemeProvider>
  );
}

export default App;
