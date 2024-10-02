import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { theme } from "../theme";
import { css } from "@emotion/react";

export const forMobiles = (...args: any) => css`
  ${theme.breakpoints.down("sm")} {
    ${css(args)};
  }
`;

export const forMobilesAndTablets = (...args: any) => css`
  ${theme.breakpoints.down("md")} {
    ${css(args)};
  }
`;

export const forTablets = (...args: any) => css`
  ${theme.breakpoints.between("sm", "md")} {
    ${css(args)};
  }
`;

export const forTabletsAndDesktop = (...args: any) => css`
  ${theme.breakpoints.up("md")} {
    ${css(args)};
  }
`;
export const forDesktop = (...args: any) => css`
  ${theme.breakpoints.up("lg")} {
    ${css(args)};
  }
`;

export const isMobileCss = theme.breakpoints.down("sm");
export const isTabletCss = theme.breakpoints.down("md") + "and " + theme.breakpoints.up("sm");
export const isDesktopCss = theme.breakpoints.up("lg");

export const useBreakpointUtils = () => {

  const isMobile = useMediaQuery(isMobileCss);
  const isTablet = useMediaQuery(isTabletCss);
  const isDesktop = useMediaQuery(isDesktopCss);

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop
    }),
    [ isDesktop, isMobile, isTablet ]
  );
};
