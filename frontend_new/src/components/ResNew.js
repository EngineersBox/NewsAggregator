import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useFetch } from "./Get";

import { useLocation, useParams, Switch, Router } from "react-router-dom";

function ResParams() {
  const params = useParams();
  console.log(params);

  const location = useLocation();
  console.log(location);

  // const [res, resStatus] = useFetch(
  //   "https://anu.jkl.io/api/"
  //     .concat(props.search)
  //     .concat("?query=")
  //     .concat(props.query)
  // );
  // const textColor = {
  //   color: "white",
  // };
  // const textColor2 = {
  //   color: "#9f9f9f",
  // };

  useEffect(() => {
    console.log(location.pathname);
    // Send request to your server to increment page view count
  }, [location]);

  return <List></List>;
}

function ResNewDemo() {
  ResParams();
  return <Switch>...</Switch>;
}
export default function ResNew() {
  return (
    <Router>
      <ResNewDemo />
    </Router>
  );
}
