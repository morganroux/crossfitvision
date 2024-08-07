import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Font files can be colocated inside of `pages`
const alternateGothic = localFont({
  src: "./Alternate_Gothic/AlternateGotNo2D.ttf",
  weight: "100 700",
});
const helvetica = localFont({
  src: "./helvetica/Helvetica.ttf",
  weight: "100 700",
});

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#EA1506",
    },
    secondary: {
      main: "#3F1099",
    },
    background: {
      default: "black",
    },
  },
});

const theme = createTheme(baseTheme, {
  typography: {
    h1: {
      fontFamily: alternateGothic.style.fontFamily,
      fontSize: "10em",
      color: baseTheme.palette.primary.main,
      textTransform: "uppercase",
      [baseTheme.breakpoints.down("lg")]: {
        fontSize: "9em",
      },
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "5em",
        lineHeight: 1,
      },
    },
    h2: {
      fontFamily: alternateGothic.style.fontFamily,
    },
    h3: {
      fontFamily: alternateGothic.style.fontFamily,
    },
    h4: {
      fontFamily: alternateGothic.style.fontFamily,
    },
    h5: {
      fontFamily: alternateGothic.style.fontFamily,
      color: baseTheme.palette.primary.main,
      textTransform: "uppercase",
    },
    h6: {
      fontFamily: alternateGothic.style.fontFamily,
    },
    body2: {
      color: "#DDDDDD",
    },
  },
});

export default theme;
