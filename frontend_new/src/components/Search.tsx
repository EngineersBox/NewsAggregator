import Grid from "@material-ui/core/Grid";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";
import { light } from "../themes/light";
import { dark } from "../themes/dark";
import { useFetch } from "./Get";
import Res from "./Res.js";
import FrontPageInfo from "./FrontPageInfo";

import Grow from "@material-ui/core/Grow";
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

function Search(props: props) {
  //input in search field
  const [searchInput, setSearchInput] = React.useState("");
  //the query from searchInput when search button pressed
  const [query, setQuery] = React.useState("");
  //two types of searches
  const [searchType, setSearchType] = React.useState("");
  const [dfpr, setDFPR] = React.useState(true);

  function GetRes(sinput: string, stype: boolean) {
    setQuery(searchInput);
    setSearchType(stype ? "search" : "origin_search");
  }
  React.useEffect(() => {
    setInterval(() => {
      if (query != "") {
        setDFPR(false);
      }
    }, 150);
  }, [query]);

  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      direction="row"
      spacing={1}
    >
      <Grow in={query ? false : true}>
        <Grid item xs={12}>
          {dfpr && <FrontPageInfo />}
        </Grid>
      </Grow>
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
        <Button
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => GetRes(searchInput, false)}
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
          onClick={() => GetRes(searchInput, true)}
        >
          Associate Search
        </Button>
      </Grid>
      <InfoButton text="This is a description" />
      <Grid item xs={12}>
        {query && <Res search={searchType} query={query} />}
      </Grid>
    </Grid>
  );
}

export default Search;
