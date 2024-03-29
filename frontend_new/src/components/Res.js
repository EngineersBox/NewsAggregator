import React from "react";
import Grid from "@material-ui/core/Grid";

import List from "@material-ui/core/List";
import { useFetch } from "./Get";
import SimpleCard from "./Cards.tsx";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";

import { useQuery } from "./Search";

function Res(props) {
  const searchParams = useQuery();
  //Validate the search
  let searchType = searchParams.get("searchType");
  if (searchType !== "search" && searchType !== "origin_search") {
    searchType = "search";
  }
  const [res, resStatus] = useFetch(
    "https://anu.jkl.io/api/"
      .concat(searchType)
      .concat("?query=")
      .concat(searchParams.get("query") || props.query)
  );

  return (
    <div>
      {!resStatus && res.result.result.length == 0 && (
        <Grid container justifyContent="center">
          <Grid item>
            <Typography>No Results Found </Typography>
          </Grid>
        </Grid>
      )}
      <List>
        {!resStatus &&
          res.result.result.map(({ _id, _score, _source }) => (
            <React.Fragment key={_id}>
              <Grow in={true} timeout={200}>
                <Grid
                  container
                  justifyContent="center"
                  direction="rows"
                  spacing={3}
                >
                  <Grid item xs={12} lg={11}>
                    <SimpleCard
                      web_link={_source.link}
                      primary={_source.title}
                      id={_id}
                      secondary={_source.summary}
                      bookmarks={props.bookmarks}
                      handlebookmark={props.handlebookmark}
                      isVisible={props.isVisible}
                    />
                  </Grid>
                </Grid>
              </Grow>
            </React.Fragment>
          ))}
      </List>
    </div>
  );
}
export default Res;
