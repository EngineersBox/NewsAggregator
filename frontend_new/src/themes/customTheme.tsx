import { createMuiTheme } from "@material-ui/core/styles";

export const light = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1D7CF2",
    },
    secondary: {
      main: "#212121",
    },
    background: {
      default: "#f7f7f7",
      paper: "#fafafa",
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
