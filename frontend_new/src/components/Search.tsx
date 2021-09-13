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
import ResNew from "./ResNew.js";
import ReactDOM from "react-dom";

// import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import {
  BrowserRouter as Router,
  Switch,
  useLocation,
  Link,
  Route,
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

// Note queryString and URLSearchParams are working similarly
function ResWithParams() {
  // console.log(prop.location);
  console.log(useLocation());
  let location = useLocation();
  const search = location.search;
  const values = queryString.parse(search.toString());
  console.log(values);
  let testQuery = useQuery();
  console.log(testQuery.get("query"));
  return (
    // Uncomment to view the output on the web rather than console
    // <>
    //   <p>
    //     <strong>Match Props: </strong>
    //     <code>{JSON.stringify(prop.match, null, 2)}</code>
    //   </p>
    //   <p>
    //     <strong>Location Props: </strong>
    //     <code>{JSON.stringify(prop.location, null, 2)}</code>
    //   </p>
    // </>
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      direction="row"
      spacing={1}
    >
      <Grid item xs={12}>
        <Res search={values.searchType} query={values.query} />
      </Grid>
    </Grid>
  );
}

function Search(props: props) {
  // const location = new URLSearchParams(useLocation().search);
  // console.log(location);

  //input in search field
  const [searchInput, setSearchInput] = React.useState("");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState("");
  //two types of searches
  const [searchType, setSearchType] = React.useState("");
  // Get the whole searchParams
  // const { search } = new URLSearchParams(useLocation().search);
  // const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   // Update the document title using the browser API
  //   if (searchParams === null) {
  //   } else {
  //     const foundQuery = searchParams.get("query");
  //     console.log("found", foundQuery);
  //   }
  // });

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
      <Router>
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
        <Grid item xs={6} lg={2}>
          <Link to={`/search?query=${searchInput}&searchType=search`}>
            <Button
              className={classes.inputButton}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => getRes(searchInput, false)}
            >
              Accurate Search
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6} lg={2}>
          <Link to={`/search?query=${searchInput}&searchType=origin_search`}>
            <Button
              className={classes.inputButton}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => getRes(searchInput, true)}
            >
              Associate Search
            </Button>
          </Link>
        </Grid>
        <InfoButton text="This is a description" />
        <Grid item xs={12}>
          {/* const searchParams = useQuery();
          console.log(searchParams.get("query")); */}
          <Route exact path="/search" component={ResWithParams} />
          {query && <Res search={searchType} query={query} />}
        </Grid>
      </Router>
    </Grid>
  );
}

export default Search;
