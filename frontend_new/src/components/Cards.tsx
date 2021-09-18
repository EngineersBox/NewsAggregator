
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    
  root: {
    width: '80%',
    marginleft: '5%',
    
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    marginleft: 12,
  },
});

type props = {
    web_link: string,
    primary : string;
    secondary: string;
  };
  
export default function SimpleCard(prop: props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent style={{backgroundColor: "#F3F3F1"}}>
        <Typography variant="body2" component="h1">
         {prop.web_link} 
        </Typography>    
        <Typography variant="h5" component="h2">
         {prop.primary} 
        </Typography>       
        <Typography variant="body2" component="p">
         {prop.secondary} 
        </Typography>
      </CardContent>
      
    </Card>
  );
}

