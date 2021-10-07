import { createMuiTheme } from "@material-ui/core/styles";

export const light = createMuiTheme({
  palette: {
    type: "light",
    primary: {
<<<<<<< HEAD

     // main: "#f0f0f0",
     //main: "#175873",
     // blue #1d7ef2
     main: "#489fc0" 
   
=======
      main: "#1D7CF2",
>>>>>>> 0d5600ad11984d4f9a3fba2889bcb01beffa9a14
    },
    secondary: {
      //main: "#212121",
      //main: "#28bbb8",
      main: "#489fc0",
    },
    background: {
<<<<<<< HEAD
      // default: "#dfdfdf",
      default: "#f2f2f2",
      //paper: "#bfbfbf",
      paper: "#fefefe",
    },
    input: {
      color: "#212121",
=======
      default: "#f2f2f2",
      paper: "#f2f2f2",
>>>>>>> 0d5600ad11984d4f9a3fba2889bcb01beffa9a14
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
    background: {
      default: "#111111",
      paper: "#212121",
    },
  },
});

export const customColours= {
    button: {
      dark: "#000000",
      light: "#00FF00",
    }  
};
