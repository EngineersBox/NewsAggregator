import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

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
function gotoLink(url: string) {
  window.location.href = url;
}

export default function SimpleCard(props: props) {
  const [bookmarked, setBookmarked] = React.useState(
    localStorage.getItem(props.id.toString()) != null || false
  );

  // Check if the article is saved in localStorage.
  // Save/ Remove 2 things into localStorage
  // 1. The article id as key so it is easier to check if the article has been saved
  // 2. the articles array with json article data to map  during bookmarks
  function handlebookmark() {
    if (localStorage.getItem(props.id.toString()) == null) {
      setBookmarked(true);
      localStorage.setItem(props.id.toString(), "saved");
      var details = {
        id: props.id,
        link: props.web_link,
        primary: props.primary,
        secondary: props.secondary,
      };
      if (localStorage.getItem("articles") != null) {
        let articleSaved = JSON.parse(localStorage.getItem("articles") || "");
        articleSaved.push(details);
        localStorage.setItem("articles", JSON.stringify(articleSaved));
      } else {
        let articleArray = [details];
        localStorage.setItem("articles", JSON.stringify(articleArray));
      }
    } else {
      setBookmarked(false);
      localStorage.removeItem(props.id.toString());
      let articleSaved = JSON.parse(localStorage.getItem("articles") || "");
      articleSaved = articleSaved.filter(
        (item: {
          id: number;
          link: string;
          primary: string;
          secondary: string;
        }) => item.id !== props.id
      );
      localStorage.setItem("articles", JSON.stringify(articleSaved));
    }
  }

  React.useEffect(() => {
    if (localStorage.getItem(props.id.toString()) != null) {
      setBookmarked(true);
    }
  }, [props.id]);

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
