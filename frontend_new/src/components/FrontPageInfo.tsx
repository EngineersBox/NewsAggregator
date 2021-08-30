import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

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
        <Typography
          color="secondary"
          align="center"
          variant="h4"
          component="h2"
        >
          NewsAggregator
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          color="secondary"
          align="center"
          variant="h5"
          component="h2"
        >
          Using Open Source Technologies to Create a Search Engine
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          color="secondary"
          align="center"
          variant="h6"
          component="h2"
          gutterBottom
        >
          NewsAggregator used Elastic Search, Redis and Rust in the backend, and
          React and Material UI for the frontend.
        </Typography>
      </Grid>
    </Grid>
  );
}
