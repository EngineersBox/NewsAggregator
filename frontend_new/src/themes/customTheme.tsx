import { createMuiTheme } from "@material-ui/core/styles";

export const light = createMuiTheme({
  palette: {
    type: "light",
    primary: {

     // main: "#f0f0f0",
     //main: "#175873",
     // blue #1d7ef2
     main: "#489fc0" 
   
    },
    secondary: {
      //main: "#212121",
      //main: "#28bbb8",
      main: "#489fc0",
    },
    themeswitch: {
      main: "#e7c926",
    },
    background: {
      // default: "#dfdfdf",
      default: "#f2f2f2",
      //paper: "#bfbfbf",
      paper: "#fefefe",
    },
    input: {
      color: "#212121",
    },
    button: {
      main: "#212121",
    },
  },
});
export const dark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#242424",
    },
    secondary: {
      main: "#c9c9c9",
    },
    themeswitch: {
      main: "#007cf2",
      alternate: "#515151",
    },
    background: {
      default: "#111111",
      paper: "#212121",
    },
    input: {
      color: "#c9c9c9",
    },
  },
});

export const customColours= {
    button: {
      dark: "#000000",
      light: "#00FF00",
    }  
};
