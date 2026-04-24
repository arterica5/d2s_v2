import { createTheme } from "@mui/material/styles";

/**
 * MUI theme for Caidentia D2S.
 * Pulls values from CSS variables declared in src/styles/tokens.css
 * so the MUI and Tailwind layers always share the same source of truth.
 */
const v = (name) => `var(--${name})`;

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#532DF6",
      dark: "#3D1FD4",
      light: "#EDE9FE",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4B5565",
      dark: "#333C48",
      light: "#E9EAEC",
    },
    error: { main: "#D32F2F", dark: "#B71C1C", light: "#FFAB9F" },
    warning: { main: "#E06900", dark: "#B34500", light: "#FFC84A" },
    info: { main: "#1565E0", dark: "#1246CC", light: "#82CAFF" },
    success: { main: "#009955", dark: "#006B3C", light: "#6DEAA6" },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    divider: "#E0E0E0",
  },
  typography: {
    fontFamily: v("font-family-base"),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: 38, fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: 32, fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: 20, fontWeight: 700, lineHeight: 1.35 },
    h5: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: 16, lineHeight: 1.5 },
    body2: { fontSize: 14, lineHeight: 1.5 },
    caption: { fontSize: 12, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
