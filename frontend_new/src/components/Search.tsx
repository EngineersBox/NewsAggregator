import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import { useFetch } from "./Get";
import Res from "./Res.js";
import FrontPageInfo from "./FrontPageInfo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      margin: theme.spacing(1),
      height: 50,
    },
    inputButton: {
      margin: theme.spacing(1),
      height: 50,
    },
  })
);
type props = {
  CustomTheme: Theme;
};

function Search(props: props) {
  //input in search field
  const [searchInput, setSearchInput] = React.useState("");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState("");
  //two types of searches
  const [searchType, setSearchType] = React.useState("");
  const [bookmarks,setBookmarks] = React.useState({}); 

  function handlebookmark(web_link : string, primary: string, secondary: string, id : integer){
  console.log("hi");
  console.log(id)
  if (id in bookmarks){
  var temp_bookmarks = bookmarks;
  delete temp_bookmarks[id];
  setBookmarks(temp_bookmarks);
	  console.log("deleting to bookmarks");
  }else{
  var temp_bookmarks = bookmarks;
  temp_bookmarks[id] = {"web_link":web_link,"primary":primary,"secondary":secondary};
	  console.log("adding to bookmarks");
   

  }




}

  function getRes(sinput: string, stype: boolean) {
    setQuery(searchInput);
    setSearchType(stype ? "search" : "origin_search");
  }
  function enterPress(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!(searchInput === "")) {
        getRes(searchInput, false);
      }
    }
  }

  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      direction="row"
      spacing={1}
    >
      <Grid item xs={12}>
        {!query && <FrontPageInfo />}
      </Grid>
      <Grid item xs={11} lg={6}>
        <TextField
          id="search-input"
          variant="outlined"
          color="secondary"
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.currentTarget.value)
          }
          InputProps={{
            className: classes.input,
          }}
          onKeyPress={(e) => enterPress(e)}
        />
      </Grid>
      <Grid item xs={6} lg={2}>
        <Button
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => getRes(searchInput, false)}
        >
          Accurate Search
        </Button>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Button
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => getRes(searchInput, true)}
        >
          Associative Search
        </Button>
      </Grid>
      <InfoButton text="This is a description" />
      <Grid item xs={12}>
        {query && (
          <Res
            search={searchType}
            query={query}
            whichTheme={props.whichTheme}
            handlebookmark = {handlebookmark}	    
	    bookmarks = {bookmarks}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Search;
