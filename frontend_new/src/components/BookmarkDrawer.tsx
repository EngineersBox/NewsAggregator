import React from "react";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import Search from "./Search";
import ThemeSwitch from "./ThemeSwitch";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import SimpleCard from "./Cards";
import Tooltip from "@material-ui/core/Tooltip";

const drawerWidth = "100%";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      zIndex: theme.zIndex.drawer + 1,
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.background.default,
      height: "100%",
      overflowX: "hidden",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);
type props = {
  bookmarks: object;
  handlebookmark: (
    web_link: string,
    primary: string,
    secondary: string,
    id: number
  ) => void;
  whichTheme: Theme;
  themeChange: () => void;
};

export default function PersistentDrawerLeft(props: props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  let bookmarkedArticles = JSON.parse(
    localStorage.getItem("articles") || "null"
  );
  bookmarkedArticles =
    bookmarkedArticles != null && bookmarkedArticles.length > 0
      ? bookmarkedArticles
      : null;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            {open ? (
              <Tooltip title="Close Bookmarks">
                <ChevronLeftIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Open Bookmarks">
                <BookmarksOutlinedIcon />
              </Tooltip>
            )}
          </IconButton>
          <Typography variant="h6"></Typography>
          <Typography variant="h6"></Typography>
          <ThemeSwitch themeChange={props.themeChange} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}></div>
        <div>
          <List>
            {bookmarkedArticles &&
              bookmarkedArticles.map(
                ({
                  id,
                  primary,
                  secondary,
                  web_link,
                }: {
                  id: number;
                  primary: string;
                  secondary: string;
                  web_link: string;
                }) => (
                  <React.Fragment key={id}>
                    <Grow in={true} timeout={200}>
                      <Grid container wrap="wrap" direction="row" spacing={3}>
                        <Grid item xs={12}>
                          <SimpleCard
                            web_link={web_link}
                            primary={primary}
                            id={id}
                            secondary={secondary}
                            bookmarks={props.bookmarks}
                            handlebookmark={props.handlebookmark}
                            isVisible={!open}
                          />
                        </Grid>
                      </Grid>
                    </Grow>
                  </React.Fragment>
                )
              )}
          </List>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container>
          <Grid item xs={12}>
            <Search
              bookmarks={props.bookmarks}
              handlebookmark={props.handlebookmark}
              isVisible={open}
            />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
