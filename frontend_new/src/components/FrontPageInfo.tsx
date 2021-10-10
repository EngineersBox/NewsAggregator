import Grid from "@material-ui/core/Grid";
import mainLogo from './Light_Mode_Logo.png';
import darkLogo from './Logo_Dark_Mode.png';
import Box from '@material-ui/core/Box'
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';

const image_size= {
  width: "50vw",
}

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(48), 
    paddingBottom: theme.spacing(4), 
    paddingTop: theme.spacing(3), 
  },
}));

export default function FrontPageInfo() {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      direction="column"
      spacing={3}
    >
      <Grid item xs={12}>
        {theme.palette.type === "dark" ? 
        (<a><img style= {image_size} src={darkLogo} alt="Dark Logo"/></a>) : 
        (<a><img style= {image_size} src={mainLogo} alt="Light Logo"/></a>)}

      </Grid>
      
    </Grid>
  );
}
