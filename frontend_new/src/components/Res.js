import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";

import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useFetch } from "./Get";
import SimpleCard from "./Cards.tsx";
import Grow from '@material-ui/core/Grow';

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
  const delay_per_result = 200;

  const [time_delay, setDelay]= useState(1);

  return (
    <List>
      {!resStatus &&
        res.result.result.map(({ _id, _score, _source }) => (
          <React.Fragment key={_id}>
            <Grow in={true} timeout={time_delay}>

            <ListItem button onClick={() => console.log(_source.link)}>
            {() => setDelay(time_delay + delay_per_result)}
              < SimpleCard 
               web_link={_source.link}
               primary={_source.title}
               secondary={_source.summary}
              />
            </ListItem>
            </Grow>
          </React.Fragment>
        ))}
    </List>
  );
}
export default Res;
