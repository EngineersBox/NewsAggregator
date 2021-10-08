import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import Res from "./Res.js";
import FrontPageInfo from "./FrontPageInfo";
import { useHistory } from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFetch } from "./Get";
import AutoCompleteRes from "./AutoCompleteRes";
import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { BrowserRouter as Router, useLocation, Route } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      height: 50,
    },
    inputButton: {
      height: 50,
    },
  })
);
type props = {
  bookmarks: object;
  handlebookmark: (
    web_link: string,
    primary: string,
    secondary: string,
    id: number
  ) => void;
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
  const [suggest, setSuggest] = React.useState([]);
  const [autocomplete, isLoadingAutoComplete] = useFetch(
    "https://anu.jkl.io/api/suggest?input=".concat(searchInput)
  );

  function getRes(sinput: string, stype: boolean) {
    setQuery(sinput);
    let inputSearchType = stype ? "search" : "origin_search";
    setSearchType(inputSearchType);
    //history.push(`/search?query=${query}&searchType=${inputSearchType}`);
  }

  React.useEffect(() => {
    history.push(`/search?query=${query}&searchType=origin_search`);
  }, [query]);

  function enterPress(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!(searchInput === "")) {
        getRes(searchInput, false);
      }
    }
  }
  const handleChangeSearchInput = (event: any) => {
    setSearchInput(event.target.value);
    if (autocomplete) {
      //@ts-ignore:
      setSuggest(Object.values(autocomplete).map((x) => x.toString()));
      console.log(suggest);
    }
  };

  const classes = useStyles();
  return (
    <Grid container justifyContent="center" direction="row" spacing={1}>
      <Grid item xs={12}>
        {!urlQuery && <FrontPageInfo />}
      </Grid>
      <Grid item xs={12} lg={8}>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          onInputChange={handleChangeSearchInput}
          onChange={(event, value) => getRes(value, false)}
          //@ts-ignore:
          getOptionSelected={(event, value) => getRes(String(value), false)}
          limitTags={5}
          //onKeyPress={(e) => console.log(e)}
          //onChange={(event, value) => getRes(value, false)}

          options={suggest}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyPress={(e) => enterPress(e)}
              color="secondary"
              defaultValue={searchInput}
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  //@ts-ignore:
                  <InputAdornment>
                    <IconButton onClick={() => getRes(searchInput, false)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                type: "search",
              }}
            />
          )}
        />
      </Grid>
      {!urlQuery && <Grid item lg={12} />}
      <Grid
        alignItems="stretch"
        style={{ display: urlQuery ? "none" : "inline-block" }}
        xs={6}
        lg={3}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => getRes(searchInput, false)}
        >
          Search
        </Button>
      </Grid>
      <Grid item xs={12} style={{ display: String(props.isVisible) }}>
        {query !== "" && query && (
          <Route path="/search">
            <Res
              search={searchType}
              query={query}
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
        bookmarks={props.bookmarks}
        handlebookmark={props.handlebookmark}
        isVisible={props.isVisible}
      />
    </Router>
  );
}
