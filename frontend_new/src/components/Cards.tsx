import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { customTheme } from "../themes/customTheme";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

type props = {
  web_link: string;
  primary: string;
  secondary: string;
  id: string;
};
function gotoLink(url: string) {
  window.location.href = url;
}

export default function SimpleCard(props: props) {
  const [bookmarked, setBookmarked] = React.useState(
    localStorage.getItem("Articles Saved") != null || false
  );

  //Problem where clearning localStorage would not update bookmarks stage
  function handlebookmark() {
    console.log(props.id);
    console.log(bookmarked);
    if (localStorage.getItem(props.id) == null) {
      setBookmarked(true);
      var details = {
        link: props.web_link,
        primary: props.primary,
        secondary: props.secondary,
      };
      localStorage.setItem(props.id, JSON.stringify(details));
      if (localStorage.getItem("Articles Saved") != null) {
        let articleSaved = JSON.parse(
          localStorage.getItem("Articles Saved") || ""
        );
        console.log("stored, ", articleSaved);
        articleSaved["articles"].push(props.id);
        localStorage.setItem("Articles Saved", JSON.stringify(articleSaved));
      } else {
        let articles = {
          articles: [props.id],
        };
        localStorage.setItem("Articles Saved", JSON.stringify(articles));
      }
    } else {
      setBookmarked(false);
      localStorage.removeItem(props.id);
      let articleSaved = JSON.parse(
        localStorage.getItem("Articles Saved") || ""
      );
      articleSaved = articleSaved["articles"].filter(
        (item) => item !== props.id
      );
      localStorage.setItem("Articles Saved", JSON.stringify(articleSaved));
    }
  }

  return (
    <Card>
      <ListItem button onClick={() => gotoLink(props.web_link)}>
        <CardContent>
          <Typography variant="body2" component="h1" color="secondary">
            {props.web_link}
          </Typography>
          <Typography variant="h5" component="h2" color="secondary">
            {props.primary}
          </Typography>
          <Typography variant="body2" component="p" color="secondary">
            {props.secondary}
          </Typography>
        </CardContent>
        <ListItemSecondaryAction>
          <IconButton color="secondary" onClick={() => handlebookmark()}>
            {bookmarked ? (
              <BookmarkOutlinedIcon />
            ) : (
              <BookmarkBorderOutlinedIcon />
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );
}
