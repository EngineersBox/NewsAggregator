import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useFetch } from "./Get";

function Res(props) {
  const [res, resStatus] = useFetch(
    "https://anu.jkl.io/api/"
      .concat(props.search)
      .concat("?query=")
      .concat(props.query)
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
export default Res;
