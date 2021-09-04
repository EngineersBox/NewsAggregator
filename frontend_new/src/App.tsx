import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { light } from "./themes/light";
import { dark } from "./themes/dark";
import "./App.css";
import TopBar from "./components/TopBar";
import Search from "./components/Search";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Helmet } from "react-helmet";
import FrontPageInfo from "./components/FrontPageInfo";

import Grow from "@material-ui/core/Grow";
function App() {
  const [themeChoice, setThemeChoice] = React.useState({
    theme: dark,
    bool: true,
  });
  const themeSwitch = () => {
    if (themeChoice.bool) {
      setThemeChoice({ theme: light, bool: false });
    } else {
      setThemeChoice({ theme: dark, bool: true });
    }
  };
  return (
    <ThemeProvider theme={{ ...themeChoice.theme }}>
      <Helmet>
        {themeChoice.bool ? (
          <style>{"body { background-color: #e5e5e5; }"}</style>
        ) : (
          <style>{"body { background-color: #212121; }"}</style>
        )}
      </Helmet>
      <TopBar themeSwitch={() => themeSwitch()} />
      <Grow in={true} timeout={600}>
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          direction="row"
          spacing={3}
          style={{
            width: "100%",
          }}
        >
          <Grid item xs={12}>
            <FrontPageInfo />
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
