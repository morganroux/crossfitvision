import { useMediaQuery, useTheme } from "@mui/material";

export const useMyMediaQueries = () => {
  const theme = useTheme();
  const matchMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  return { matchMobile };
};
