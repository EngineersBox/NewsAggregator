import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import Switch from "@material-ui/core/Switch";
import Drawers from "./Drawers";
import { isPropertySignature } from "typescript";
import { light } from "../themes/light";
import { dark } from "../themes/dark";

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
type props = {
  themeSwitch: () => void;
};

export default function TopBar(props: props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar >
        <Drawers themeSwitch={() => themeSwitch()} />
            <Switch
              defaultChecked
              color="default"
              onChange={() => props.themeSwitch()}
            />

            
        </Toolbar>
      </AppBar>
    </div>
  );
}

function themeSwitch(): void {
  throw new Error("Function not implemented.");
}
