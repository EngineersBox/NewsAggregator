import './App.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      margin: theme.spacing(1),
      height: 60 
    }
  })
);
function Search(props) {
const classes = useStyles();
  return (
	<Grid container justifyContent="center" direction="row" spacing={1} >
		<Grid item xs={11} lg={6}>
			<TextField
			    id="search-input"
			    variant="outlined"
			    color="secondary"
				fullWidth
				  InputProps={{
			  className: classes.input
			}}
			  />
			  </Grid>
		<Grid item xs={5} lg={2}  >
			    <Button className={classes.input} variant="contained" color="secondary"  fullWidth>
				    Accurate Search
      </Button>
			  </Grid>
		<Grid item xs={5} lg={2}  >
			    <Button className={classes.input}  variant="contained"  color="secondary"  fullWidth>
				    Associate Search
      </Button>
			  </Grid>
				  </Grid>

  );
}

export default Search;
