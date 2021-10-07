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
  const [bookmarked, setBookmarked] = React.useState(true);
  function handlebookmark() {
    props.handlebookmark(
      props.web_link,
      props.primary,
      props.secondary,
      props.id
    );
    setBookmarked(props.id in props.bookmarks);
  }

  React.useEffect(() => {
    setBookmarked(props.id in props.bookmarks);
  }, [props.bookmarks, props.isVisible]);

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
