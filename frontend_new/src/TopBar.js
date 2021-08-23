import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import Grid from '@material-ui/core/Grid';

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
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
            <BookmarksOutlinedIcon />
          </IconButton>
	   <Typography variant="h6" className={classes.title}>
          </Typography>
          <Typography variant="h6" >
            NewsAggregator
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
