import Grid from "@material-ui/core/Grid";
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import { light } from "../themes/light";
import { dark } from "../themes/dark";
import { useFetch } from "./Get";
import Res from "./Res.js";

// import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

//using colors from theme - bit hacky but works
const darkPrimary = dark.palette.primary.main;
const darkSecondary = dark.palette.secondary.main;
const lightPrimary = dark.palette.primary.main;
const lightSecondary = dark.palette.secondary.main;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputLight: {
      margin: theme.spacing(1),
      height: 50,
      color: lightPrimary,
    },
    inputDark: {
      margin: theme.spacing(1),
      height: 50,
      color: darkSecondary,
    },
    inputButton: {
      margin: theme.spacing(1),
      height: 50,
    },
    root: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: darkSecondary,
      },
    },
  })
);
type props = {
  whichTheme: boolean;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search(props: props) {
  //input in search field
  const [searchInput, setSearchInput] = React.useState("");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState("");
  //two types of searches
  const [searchType, setSearchType] = React.useState("");
  // Get the whole searchParams
  // const { search } = new URLSearchParams(useLocation().search);
  // const [searchParams, setSearchParams] = useSearchParams();
  let location = useLocation();
  console.log(location);

  // useEffect(() => {
  //   if (search) {
  //     // const values = queryString.parse(search);
  //     console.log(values);
  //     // setQuery(searchParams.get("query") || ""); //get the query
  //     // setSearchType(searchParams.get("search") || ""); //get the searchType
  //   }
  // }, []);

  function getRes(sinput: string, stype: boolean) {
    setQuery(searchInput);
    setSearchType(stype ? "search" : "origin_search");
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
      <Grid item xs={11} lg={6}>
        <TextField
          id="search-input"
          variant="outlined"
          color="secondary"
          className={props.whichTheme ? classes.root : ""}
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.currentTarget.value)
          }
          InputProps={
            props.whichTheme
              ? {
                  className: classes.inputDark,
                }
              : { className: classes.inputLight }
          }
        />
      </Grid>
      {/* <Router> */}
      <Grid item xs={6} lg={2}>
        {/* <Link to={`/query/${searchInput}`}> */}
        <Button
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => getRes(searchInput, false)}
        >
          Accurate Search
        </Button>
        {/* </Link> */}
      </Grid>
      <Grid item xs={6} lg={2}>
        {/* <Link to={`/query/${searchInput}`}> */}
        <Button
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => getRes(searchInput, true)}
        >
          Associate Search
        </Button>
        {/* </Link> */}
      </Grid>
      {/* </Router> */}
      <InfoButton text="This is a description" />
      <Grid item xs={12}>
        {/* <Router>
          <Switch>
            <Route path="/query/:query"> <Res search={searchType} query={query} /> </Route>
          </Switch>
        </Router> */}
        {query && <Res search={searchType} query={query} />}
      </Grid>
    </Grid>
  );
}

export default Search;
