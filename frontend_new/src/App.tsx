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
import FrontPageInfo from "./components/FrontPageInfo";

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
          <Grid item xs={12}></Grid>
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
