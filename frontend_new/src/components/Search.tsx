import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import { light } from "../themes/light";
import { dark } from "../themes/dark";
import Res from "./Res.js";

import {
  BrowserRouter as Router,
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

function SearchInfo(props: props) {
  const urlQuery = useQuery().get("query");
  //input in search field
  const [searchInput, setSearchInput] = React.useState(urlQuery || "");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState(urlQuery || "");
  //two types of searches
  const [searchType, setSearchType] = React.useState("");

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
            defaultValue={searchInput}
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
          <Route exact path="/search" component={Res} />
        </Grid>
      </Router>
    </Grid>
  );
}

export default function Search(prop: props) {
  return (
    <Router>
      <SearchInfo whichTheme={prop.whichTheme} />
    </Router>
  );
}
