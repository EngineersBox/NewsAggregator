import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InfoButton from "./SlideAlert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputLight: {
      margin: theme.spacing(1),
      height: 50,
      color: "#e5e5e5",
    },
    inputDark: {
      margin: theme.spacing(1),
      height: 50,
      color: "#212121",
    },
    inputButton: {
      margin: theme.spacing(1),
      height: 50,
    },
  })
);

type props = {
  whichTheme: boolean;
};

function Search(props: props) {
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
          fullWidth
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
        >
          Associate Search
        </Button>
      </Grid>
      <InfoButton text="This is a description" />
    </Grid>
  );
}

export default Search;
