import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import mainLogo from './v4.png';
import Box from '@material-ui/core/Box'

export default function FrontPageInfo() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="stretch"
      direction="row"
      spacing={3}
    >
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
      <Box paddingLeft={58}> 
          { <img  src={mainLogo} alt="Logo"/> }
      </Box>
      </Grid>
    </Grid>
  );
}
