import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import Switch from "@material-ui/core/Switch";
import BookmarkDrawer from "./BookmarkDrawer";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
type props = {
  themeSwitch: () => void;
  themeChoice: Theme;
};

export default function TopBar(props: props) {
  const classes = useStyles();

  let isSavedColourDark =
    localStorage.getItem("themeChoice") === "dark" ? true : false;
  const [checked, setChecked] = React.useState(isSavedColourDark || "");

  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.themeSwitch();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="secondary"
            aria-label="menu"
          >
            <SettingsOutlinedIcon />
          </IconButton>
          <BookmarkDrawer />
          <Typography variant="h6" className={classes.title}></Typography>
          <Typography variant="h6"></Typography>
          <Switch checked={checked} color="default" onChange={handleChange} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
