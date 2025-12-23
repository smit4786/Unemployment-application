"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003865", // MN State Blue
      light: "#336699",
      dark: "#002240",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#78BE20", // MN State Green
      light: "#95D645",
      contrastText: "#003865",
    },
    background: {
      default: "#F4F7FA", // Airy light blue-gray
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: "2.75rem",
      fontWeight: 800,
      color: "#003865",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 700,
      color: "#003865",
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shape
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 56, 101, 0.15)",
          },
        },
        contained: {
             boxShadow: "0 2px 8px rgba(0, 56, 101, 0.2)",
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "none",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)", // Soft floaty shadow
          backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
           boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#E2E8F0",
            },
            "&:hover fieldset": {
              borderColor: "#CBD5E0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#003865",
            },
          },
        },
      },
    },
  },
});

export default theme;
