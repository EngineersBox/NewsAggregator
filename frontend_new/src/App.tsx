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

//using colors from theme - bit hacky but works
function App() {
  const [themeChoice, setThemeChoice] = React.useState(dark);
  React.useEffect(() => {
    document.body.style.backgroundColor =
      themeChoice.palette.background.default;
  }, [themeChoice]);
  const themeSwitch = () => {
    if (themeChoice.palette.type === "dark") {
      setThemeChoice(light);
    } else {
      setThemeChoice(dark);
    }
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
                  <Grid container >
		  <Grid item xs={12}>
      <Grow in={true} timeout={600}>
            <BookmarkDrawer
              whichTheme={themeChoice}
              bookmarks={bookmarks}
              handlebookmark={handlebookmark}
	      themeSwitch={themeSwitch}
            />
      </Grow>
		  </Grid>
		  </Grid>
    </ThemeProvider>
  );
}

export default App;
