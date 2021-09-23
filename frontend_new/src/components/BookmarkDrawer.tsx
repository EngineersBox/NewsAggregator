import React from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 300,
  },
  fullList: {
    width: "auto",
  },
}));

type Anchor = "bookmark";
type props = {
  whichTheme: boolean;
};

export default function BookmarkDrawer(props: props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    bookmark: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, false)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List></List>
    </div>
  );

  return (
    <div>
      {["bookmark"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="secondary"
            aria-label="menu"
            onClick={toggleDrawer("bookmark", true)}
          >
            <BookmarksOutlinedIcon />
          </IconButton>
          <Drawer
            anchor={"left"}
            open={state["bookmark"]}
            onClose={toggleDrawer("bookmark", false)}
          >
            {list("bookmark")}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
