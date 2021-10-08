import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import mainLogo from './Light_Mode_Logo.png';
import darkLogo from './Logo_Dark_Mode.png';
import Box from '@material-ui/core/Box'
import { ThemeProvider, useTheme } from "@material-ui/core/styles";

export default function FrontPageInfo() {
  const theme = useTheme();
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
      {/* // @ts-ignore: */}
      {theme.palette.type === "dark" ? <img src={darkLogo} alt="Logo"/> : <img src={mainLogo} alt="Logo"/>};

      </Box>
      </Grid>
    </Grid>
  );
}
