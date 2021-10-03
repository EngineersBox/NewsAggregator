import { blue } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";


export const light = createMuiTheme({
  palette: {
    primary: {
      // Colour of bar
      main: "#f0f0f0",
    },
    secondary: {
      //Buttons
      main: "#212121",
      
    },
    // tertiary: {
    //   main: "#52ab98",
    // }
    background: {
      //default: "#dfdfdf",
      default: "#f2f2f2",
      //paper: "#bfbfbf",
      paper: "#ffffff",
      
    },
  },
});
