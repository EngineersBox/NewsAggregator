import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { theme1 } from "./themes/theme1";
import { theme2 } from "./themes/theme2";
import "./App.css";
import TopBar from "./components/TopBar";
import Search from "./components/Search";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Helmet } from "react-helmet";

import Grow from "@material-ui/core/Grow";
function App() {
  const [themeChoice, setThemeChoice] = React.useState({
    theme: theme2,
    bool: true,
  });
  const themeSwitch = () => {
    if (themeChoice.bool) {
      setThemeChoice({ theme: theme1, bool: false });
    } else {
      setThemeChoice({ theme: theme2, bool: true });
    }
  };
  console.log(themeChoice.theme);
  return (
    <ThemeProvider theme={{ ...themeChoice.theme }}>
      <Helmet>
        {themeChoice.bool ? (
          <style>{"body { background-color: #e5e5e5; }"}</style>
        ) : (
          <style>{"body { background-color: #212121; }"}</style>
        )}
      </Helmet>
      <Grow in={true} timeout={600}>
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          direction="row"
          spacing={3}
        >
          <Grid item xs={12}>
            <TopBar themeSwitch={() => themeSwitch()} />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Typography
              color="secondary"
              align="center"
              variant="h4"
              component="h2"
              gutterBottom
            >
              Using Open Source Technologies to Create a Search Engine
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              color="secondary"
              align="center"
              variant="h5"
              component="h2"
              gutterBottom
            >
              NewsAggregator used Elastic Search, Redis and Rust in the backend,
              and React and Material UI for the frontend.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Search whichTheme={themeChoice.bool} />
          </Grid>
        </Grid>
      </Grow>
    </ThemeProvider>
  );
}

export default App;
