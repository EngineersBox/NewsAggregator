import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { dark, light } from "./themes/customTheme";
import "./App.css";
import TopBar from "./components/TopBar";
import BookmarkDrawer from "./components/BookmarkDrawer";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FrontPageInfo from "./components/FrontPageInfo";
import Grow from "@material-ui/core/Grow";
import getDefaultTheme from "./components/ThemeSetting";

//using colors from theme - bit hacky but works
function App() {
  let themeColourSaved = localStorage.getItem("themeChoice");
  let themeColor =
    themeColourSaved == null ? getDefaultTheme() : themeColourSaved;

  const [themeChoice, setThemeChoice] = React.useState(
    themeColor ? dark : light
  );
  React.useEffect(() => {
    document.body.style.backgroundColor =
      themeChoice.palette.background.default;
  }, [themeChoice]);
  const themeChange = () => {
    let themeColourSwitch = themeChoice.palette.type === "dark" ? light : dark;
    setThemeChoice(themeColourSwitch);
    localStorage.setItem("themeChoice", themeColourSwitch.palette.type);
  };

  const [bookmarks, setBookmarks] = React.useState({});
  function handlebookmark(
    web_link: string,
    primary: string,
    secondary: string,
    id: integer
  ) {
    if (id in bookmarks) {
      let temp_bookmarks = bookmarks;
      delete temp_bookmarks[id];
      setBookmarks(temp_bookmarks);
    } else {
      let temp_bookmarks = bookmarks;
      temp_bookmarks[id] = {
        web_link: web_link,
        primary: primary,
        secondary: secondary,
        id: id,
      };
    }
  }
  return (
    <ThemeProvider theme={{ ...themeChoice }}>
      <Grid container>
        <Grid item xs={12}>
          <Grow in={true} timeout={600}>
            <BookmarkDrawer
              whichTheme={themeChoice}
              bookmarks={bookmarks}
              handlebookmark={handlebookmark}
              themeChange={themeChange}
            />
          </Grow>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
