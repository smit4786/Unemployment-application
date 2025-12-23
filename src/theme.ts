"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003865", // MN State Blue
    },
    secondary: {
      main: "#78BE20", // MN State Green/Nature
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#003865",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#003865",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
