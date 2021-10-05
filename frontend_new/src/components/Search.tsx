import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import Res from "./Res.js";
import FrontPageInfo from "./FrontPageInfo";
import { useHistory } from "react-router-dom";

import {
  BrowserRouter as Router,
  useLocation,
  Link,
  Route,
} from "react-router-dom";

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
  handlebookmark: () => void;
  bookmarks: array;
  isVisible: boolean;
};

// Thinking of moving this to a folder/file that stores common functionality
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchInfo(props: props) {
  const urlQuery = useQuery().get("query");
  const urlSearchType = useQuery().get("searchType");
  const history = useHistory();

  //input in search field
  const [searchInput, setSearchInput] = React.useState(urlQuery || "");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState(urlQuery || "");
  //two types of searches
  const [searchType, setSearchType] = React.useState(urlSearchType || "");

  function getRes(sinput: string, stype: boolean) {
    setQuery(sinput);
    let inputSearchType = stype ? "search" : "origin_search";
    setSearchType(inputSearchType);
    history.push(`/search?query=${searchInput}&searchType=${inputSearchType}`);
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
          defaultValue={searchInput}
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
      <Grid item xs={12} style={{ display: props.isVisible && "none" }}>
        {query && (
          <Route path="/search">
            <Res
              search={searchType}
              query={query}
              whichTheme={props.whichTheme}
              handlebookmark={props.handlebookmark}
              bookmarks={props.bookmarks}
              isVisible={props.isVisible}
            />
          </Route>
        )}
      </Grid>
    </Grid>
  );
}

export default function Search(props: props) {
  return (
    <Router>
      <SearchInfo
        whichTheme={props.themeChoice}
        bookmarks={props.bookmarks}
        handlebookmark={props.handlebookmark}
        isVisible={props.isVisible}
      />
    </Router>
  );
}
