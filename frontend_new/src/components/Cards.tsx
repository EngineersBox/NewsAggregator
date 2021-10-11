import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';

type props = {
  web_link: string;
  primary: string;
  secondary: string;
  id: number;
  handlebookmark: (
    web_link: string,
    primary: string,
    secondary: string,
    id: number
  ) => void;
  bookmarks: object;
  isVisible: boolean;
};

const useStyles = makeStyles((theme) => ({
  light_h1: {
    color: "#7AC39C",
  },
  dark_h1: {
    color: "#288140",   
  },
  light_h2: {
    color: "#ffffff",
  },
  dark_h2: {
    color: "#4942F4",   
  },
}));
function gotoLink(url: string) {
  window.location.href = url;
}

export default function SimpleCard(props: props) {
  let articleSaved = JSON.parse(localStorage.getItem("articles") || "null");
  let initialState =
    articleSaved && articleSaved.hasOwnProperty(props.id) ? true : false;
  const [bookmarked, setBookmarked] = React.useState(initialState);

  function handlebookmark() {
    let articleSavedObject = JSON.parse(
      localStorage.getItem("articles") || "null"
    );

    // Check if the object has the key
    if (articleSavedObject && articleSavedObject.hasOwnProperty(props.id)) {
      // Remove the saved article
      setBookmarked(false);
      delete articleSavedObject[props.id];
      localStorage.setItem("articles", JSON.stringify(articleSavedObject));
    } else {
      // Add article
      setBookmarked(true);
      let articleDetails = {
        id: props.id,
        web_link: props.web_link,
        primary: props.primary,
        secondary: props.secondary,
      };
      // Check if the Object is null and decalre {}
      if (
        articleSavedObject === null ||
        Object.keys(articleSavedObject).length === 0
      ) {
        let articleInitialObject: any = {};
        articleSavedObject = articleInitialObject;
      }
      articleSavedObject[props.id.toString()] = articleDetails;
      localStorage.setItem("articles", JSON.stringify(articleSavedObject));
    }
  }

  React.useEffect(() => {
    articleSaved && articleSaved.hasOwnProperty(props.id)
      ? setBookmarked(true)
      : setBookmarked(false);
  }, [props.id, articleSaved]);
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Card>
      <ListItem button onClick={() => gotoLink(props.web_link)}>
              <Grid container>
                <Grid item  xs={12} lg={10}>
        <CardContent>
              <Grid
                container
              >
                <Grid item xs={12}>
          <Typography 
          variant="body2" 
          component="h1" 
          className = {theme.palette.type === "dark" ? (classes.light_h1) : (classes.dark_h1)}
          >
            {props.web_link}
          </Typography>
          <Typography variant="h5" component="h2" 
          className = {theme.palette.type === "dark" ? (classes.light_h2) : (classes.dark_h2)}>
            {props.primary}
          </Typography>
          <Typography variant="body2" component="p" color="secondary">
            {props.secondary}
          </Typography>
	  </Grid>
	  </Grid>
        </CardContent>
	  </Grid>
	  </Grid>
        <ListItemSecondaryAction>
          <IconButton color="secondary" onClick={() => handlebookmark()}>
            {bookmarked ? (
              <Tooltip title="Remove Bookmark">
                <BookmarkOutlinedIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Add Bookmark">
                <BookmarkBorderOutlinedIcon />
              </Tooltip>
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );
}
