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
      default: "#f0f0f0",
      paper: "#fafafa",
    },
  },
});
export const dark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2A3537",
    },
    secondary: {
      main: "#c9c9c9",
    },
    background: {
      default: "#171F24",
      paper: "#2A3537",
    },
  },
});

export const customColours = {
  button: {
    dark: "#000000",
    light: "#00FF00",
  },
  title: {
    dark: "#ffffff",
    light: "#4942F4",
  },
  weblink: {
    light: "#288140",
    dark: "#7AC39C",
  },
};
