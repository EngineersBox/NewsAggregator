import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useFetch } from "./Get";
import SimpleCard from "./Cards.tsx";
import Grow from "@material-ui/core/Grow";

import { useQuery } from "./Search";

function Res() {
  const searchParams = useQuery();
  //Validate the search
  let searchType = searchParams.searchType;
  if (searchType !== "search" || searchType !== "origin_search") {
    searchType = "search";
  }
  const [res, resStatus] = useFetch(
    "https://anu.jkl.io/api/"
      .concat(searchType)
      .concat("?query=")
      .concat(searchParams.get("query"))
  );
  const textColor = {
    color: "white",
  };
  const textColor2 = {
    color: "#9f9f9f",
  };
  const delay_per_result = 200;

  const [time_delay, setDelay] = useState(1);
  function gotoLink(url: string) {
    window.location.href = url;
  }

  return (
    <List>
      {!resStatus &&
        res.result.result.map(({ _id, _score, _source }) => (
          <React.Fragment key={_id}>
            <Grow in={true} timeout={200}>
              <SimpleCard
                web_link={_source.link}
                primary={_source.title}
                secondary={_source.summary}
              />
            </Grow>
          </React.Fragment>
        ))}
    </List>
  );
}
export default Res;
