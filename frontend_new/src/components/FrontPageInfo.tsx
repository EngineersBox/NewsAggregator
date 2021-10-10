import Grid from "@material-ui/core/Grid";
import mainLogo from './Light_Mode_Logo.png';
import darkLogo from './Logo_Dark_Mode.png';
import Box from '@material-ui/core/Box'
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';

const image_size= {
  height: 150,
  width: 600,
}
const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(45), //grid padding
    paddingBottom: theme.spacing(3), //grid padding
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
      direction="row"
      spacing={3}
    >
      <Grid item xs={12}></Grid>
      <Grid item xs={12} lg={12}>
      <Box className={classes.paper} > 
      {theme.palette.type === "dark" ? (<a><img style= {image_size} src={darkLogo} alt="Dark Logo"/></a>) : 
        (<a><img style= {image_size} src={mainLogo} alt="Light Logo"/></a>)}

      </Box>
      </Grid>
    </Grid>
  );
}
