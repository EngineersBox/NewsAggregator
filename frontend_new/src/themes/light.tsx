import { createMuiTheme } from "@material-ui/core/styles";

export const light = createMuiTheme({
  palette: {
    primary: {
      main: "#f0f0f0",
    },
    secondary: {
      main: "#212121",
    },
    background: {
      default: "#dfdfdf",
      paper: "#bfbfbf",
    },
  },
});
