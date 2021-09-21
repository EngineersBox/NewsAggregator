import { createMuiTheme } from "@material-ui/core/styles";

export const dark = createMuiTheme({
  palette: {
    primary: {
      main: "#242424",
    },
    secondary: {
      main: "#c9c9c9",
    },
    background: {
      default: "#111111",
      paper: "#313131",
    },
  },
});
