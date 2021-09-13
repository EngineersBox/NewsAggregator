import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useFetch } from "./Get";

import { useLocation } from "react-router-dom";

function ResNew() {
  // Not sure if we want to import useQuery function from Search.tsx for this
  const searchParams = new URLSearchParams(useLocation().search);
  const [res, resStatus] = useFetch(
    "https://anu.jkl.io/api/"
      .concat(searchParams.get("searchType"))
      .concat("?query=")
      .concat(searchParams.get("query"))
  );
  const textColor = {
    color: "white",
  };
  const textColor2 = {
    color: "#9f9f9f",
  };

  return (
    <List>
      {!resStatus &&
        res.result.result.map(({ _id, _score, _source }) => (
          <React.Fragment key={_id}>
            <ListItem button>
              <ListItemText
                secondaryTypographyProps={{ style: textColor2 }}
                primaryTypographyProps={{ style: textColor }}
                primary={_source.title}
                secondary={_source.summary}
              />
            </ListItem>
          </React.Fragment>
        ))}
    </List>
  );
}
export default ResNew;
