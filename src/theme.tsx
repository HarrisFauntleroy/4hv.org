import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const globalStyles = {
  global: () => ({
    "html, body, #__next": {
      fontKerning: "auto",
      fontSmooth: "antialiased",
      minHeight: "100vh",
      maxWidth: "100vw",
      display: "flex",
      padding: 0,
      margin: 0,
    },
    ".w-md-editor-show-preview": {
      boxShadow: "0px !important",
    },
  }),
};

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const colors = {
  black: "#0e1012",
  gray: {
    "50": "#f9fafa",
    "100": "#f1f1f2",
    "200": "#e7e7e8",
    "300": "#d3d4d5",
    "400": "#abadaf",
    "500": "#7d7f83",
    "600": "#52555a",
    "700": "#2D2E39",
    "800": "#121212",
    "900": "#171a1d",
  },
  cool: { 100: "#FFFFFF" },
  whiteAlpha: {
    300: "#D2E2F4",
  },
  purple: {
    "50": "#f9f6fd",
    "100": "#e5daf8",
    "200": "#d3bef4",
    "300": "#b795ec",
    "400": "#a379e7",
    "500": "#8952e0",
    "600": "#7434db",
    "700": "#6023c0",
    "800": "#4f1d9e",
    "900": "#3b1676",
  },
  pink: {
    "50": "#fdf5f9",
    "100": "#f8d9e7",
    "200": "#f3b9d3",
    "300": "#eb8db8",
    "400": "#e56ba2",
    "500": "#dc3882",
    "600": "#c4246c",
    "700": "#a01d58",
    "800": "#7d1745",
    "900": "#5d1133",
  },
  red: {
    "50": "#fdf6f5",
    "100": "#f8d9d7",
    "200": "#f2b7b4",
    "300": "#ea8c87",
    "400": "#e5726b",
    "500": "#dd4840",
    "600": "#c72d25",
    "700": "#a1241e",
    "800": "#891f19",
    "900": "#641712",
  },
  orange: {
    "50": "#fdfaf6",
    "100": "#f9ebdb",
    "200": "#f1d4b1",
    "300": "#e6b273",
    "400": "#dc9239",
    "500": "#c37b24",
    "600": "#a5681e",
    "700": "#835318",
    "800": "#674113",
    "900": "#553610",
  },
  yellow: {
    "50": "#fefefc",
    "100": "#fbf9ea",
    "200": "#f4eec2",
    "300": "#ece192",
    "400": "#dfce4b",
    "500": "#bba922",
    "600": "#95871c",
    "700": "#746915",
    "800": "#574f10",
    "900": "#48410d",
  },
  green: {
    "50": "#f5fdf9",
    "100": "#c6f5e0",
    "200": "#83e9bb",
    "300": "#28d889",
    "400": "#23bd78",
    "500": "#1ea367",
    "600": "#198755",
    "700": "#136942",
    "800": "#105636",
    "900": "#0d472d",
  },
  teal: {
    "50": "#f1fcfc",
    "100": "#c0f1f4",
    "200": "#84e4e9",
    "300": "#2dd1da",
    "400": "#22b2ba",
    "500": "#1d979e",
    "600": "#187b80",
    "700": "#125f64",
    "800": "#0f5053",
    "900": "#0d4244",
  },
  cyan: {
    "50": "#f4fbfd",
    "100": "#d0eef7",
    "200": "#bae7f3",
    "300": "#a2deee",
    "400": "#53c2e1",
    "500": "#2ab4d9",
    "600": "#24a2c4",
    "700": "#1e86a2",
    "800": "#196e85",
    "900": "#135567",
  },
  blue: {
    "50": "#f1f6fd",
    "100": "#cde0f6",
    "200": "#a8c8f0",
    "300": "#7fafe8",
    "400": "#5896e1",
    "500": "#347fdb",
    "600": "#236abf",
    "700": "#1b5192",
    "800": "#164278",
    "900": "#123662",
  },
  primary: {
    "50": "#f9f6fd",
    "100": "#e7dbf9",
    "200": "#d2bcf3",
    "300": "#b896ec",
    "400": "#a980e9",
    "500": "#9461e3",
    "600": "#8145de",
    "700": "#6926d0",
    "800": "#5921b1",
    "900": "#411881",
  },
  brand: {
    orange: "#E15F43",
  },
};

const fonts = {
  body: "Arial, sans-serif",
  heading: "Lato",
  mono: "Menlo, monospace",
};

const breakpoints = {
  "xs": "480px",
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px",
};

const components = {
  Avatar: {
    variants: {
      square: {
        borderRadius: "5px",
      },
    },
  },
  Steps,
  Form: {
    variants: {
      floating: {
        container: {
          "_focusWithin": {
            label: {
              ...activeLabelStyles,
            },
          },
          "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label":
            {
              ...activeLabelStyles,
            },
          "label": {
            top: 0,
            left: 0,
            zIndex: 2,
            position: "absolute",
            backgroundColor: "var(--chakra-colors-chakra-body-bg)",
            pointerEvents: "none",
            mx: 3,
            px: 1,
            my: 2,
            transformOrigin: "left top",
          },
        },
      },
    },
  },
};

const brand = {
  900: "#1a365d",
  800: "#153e75",
  700: "#2a69ac",
};

export const theme = extendTheme({
  colors,
  useSystemColorMode: true,
  styles: globalStyles,
  fonts,
  brand,
  breakpoints,
  components,
});
