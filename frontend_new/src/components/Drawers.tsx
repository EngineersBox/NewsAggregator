import React from "react";
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import Switch from "@material-ui/core/Switch";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { light } from "../themes/light";
import { dark } from "../themes/dark";
import { ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

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
    width: 200,
  },
  fullList: {
    width: 'auto',
  },
}));
type props = {
  themeSwitch: () => void;
};

type Anchor = 'setting' | 'bookmark';

export default function Drawers(props: props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    setting: false,
    bookmark: false,
  });


  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
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
      <List>
      </List>
    </div>
    );

    const [themeChoice, setThemeChoice] = React.useState({
      theme: dark,
      bool: true,
    });


  return (
    <Grid>
         {['setting'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <IconButton
             edge="end"
            className={classes.menuButton}
            color="secondary"
            aria-label="menu"
            onClick={toggleDrawer('setting', true)}
          >
             <SettingsOutlinedIcon />
            </IconButton>
          <Drawer anchor={'left'} open={state['setting']} onClose={toggleDrawer('setting', false)}>
                            {list('setting')}
                    </Drawer>
                        </React.Fragment>
                    ))} 
           
           {['bookmark'].map((anchor) => (
            <React.Fragment key={anchor}>
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="secondary"
            aria-label="menu"
            onClick={toggleDrawer('bookmark', true)}
          >
            <BookmarksOutlinedIcon />
          </IconButton>
          <Drawer anchor={'left'} open={state['bookmark']} onClose={toggleDrawer('bookmark', false)}>
              {list('bookmark')}
            </Drawer>
          </React.Fragment>
      ))}
      <Typography variant="h6" className={classes.title}></Typography>
      <Typography variant="h6"></Typography>
          
      </Grid>
  );
}
