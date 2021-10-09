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
      default: "#f2f2f2",
      paper: "#e2e2e2",
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
