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
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";

type props = {
  web_link: string;
  primary: string;
  secondary: string;
  id : integer;
  handlebookmark: () => void;
  bookmarks: array;
};
function gotoLink(url: string) {
  window.location.href = url;
}

export default function SimpleCard(props: props) {
const [bookmarked,setBookmarked] = React.useState(true);
function handlebookmark(){
props.handlebookmark(props.web_link,props.primary,props.seconday,props.id)
	  if (props.id in props.bookmarks){setBookmarked(true)}
	else {setBookmarked(false)}



}


  React.useEffect(()=>{
	console.log("in use effect");
	  if (props.id in props.bookmarks){setBookmarked(true)}
	else {setBookmarked(false)}
},[props.bookmarks]);

  return (
    <Grid container justifyContent="center">
      <Grid xs={12} md={12} lg={11}>
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
              <IconButton
                color="secondary"
                onClick={() =>handlebookmark()}              >
               {bookmarked ? <BookmarkOutlinedIcon />: <BookmarkBorderOutlinedIcon />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Card>
      </Grid>
    </Grid>
  );
}
