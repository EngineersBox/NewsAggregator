import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { light } from "../themes/light";
import { dark } from "../themes/dark";
const darkCard = dark.palette.background.paper;
const lightCard = light.palette.background.paper;

type props = {
  web_link: string;
  primary: string;
  secondary: string;
  whichTheme: boolean;
};

export default function SimpleCard(props: props) {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid xs={12} md={12} lg={11}>
        <Card
          style={
            props.whichTheme
              ? { backgroundColor: darkCard }
              : { backgroundColor: lightCard }
          }
        >
          <CardContent>
            <Typography variant="body2" component="h1" color="secondary">
              {props.web_link}
            </Typography>
            <Typography variant="h5" component="h2" color="secondary">
              {props.primary}
            </Typography>
            <Typography variant="body2" component="p" color="secondary">
              {props.secondary}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
