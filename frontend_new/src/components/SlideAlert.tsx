import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import IconButton from "@material-ui/core/IconButton";
import { TransitionProps } from "@material-ui/core/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type props = {
  text: string;
};


export default function AlertDialogSlide(props: props) {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton color="secondary" onClick={handleClickOpen}>
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        color="secondary"
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" >{"Information" }</DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-slide-description" color="secondary">
            NewsAggregator used Elastic Search, Redis and Rust in the backend,
            and React and Material UI for the frontend.
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" color="secondary">
            Accurate Search: Search via a basic query matching keyword
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description"
            color="secondary">
            Associative Search: Search using a classification model, KNN
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
