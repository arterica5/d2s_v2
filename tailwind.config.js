/** @type {import('tailwindcss').Config} */

/**
 * Caidentia D2S — Tailwind Config
 *
 * All tokens map 1:1 to CSS variables defined in src/styles/tokens.css.
 * Changing a value means editing the CSS file, not this config.
 *
 * Usage:
 *   bg-surface-paper, text-primary, rounded-lg, p-xl
 *   bg-status-inprogress-bg / text-status-inprogress-fg
 *   shadow-elevation-2
 */

const cssVar = (name) => `var(--${name})`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "444px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
    },
    fontFamily: {
      sans: [cssVar("font-family-base")],
      mono: [cssVar("font-family-mono")],
    },
    fontWeight: {
      light: cssVar("font-weight-light"),
      normal: cssVar("font-weight-regular"),
      medium: cssVar("font-weight-medium"),
      semibold: cssVar("font-weight-semibold"),
      bold: cssVar("font-weight-bold"),
    },
    fontSize: {
      xs: [cssVar("font-size-xs"), { lineHeight: cssVar("line-height-normal") }],
      sm: [cssVar("font-size-sm"), { lineHeight: cssVar("line-height-relaxed") }],
      md: [cssVar("font-size-md"), { lineHeight: cssVar("line-height-relaxed") }],
      lg: [cssVar("font-size-lg"), { lineHeight: cssVar("line-height-relaxed") }],
      xl: [cssVar("font-size-xl"), { lineHeight: cssVar("line-height-relaxed") }],
      "2xl": [cssVar("font-size-2xl"), { lineHeight: cssVar("line-height-relaxed") }],
      h5: [cssVar("font-size-h5"), { lineHeight: cssVar("line-height-normal"), fontWeight: "600" }],
      h4: [cssVar("font-size-h4"), { lineHeight: cssVar("line-height-snug"), fontWeight: "700" }],
      h3: [cssVar("font-size-h3"), { lineHeight: cssVar("line-height-snug"), fontWeight: "700" }],
      h2: [cssVar("font-size-h2"), { lineHeight: cssVar("line-height-tight"), fontWeight: "700" }],
      h1: [cssVar("font-size-h1"), { lineHeight: cssVar("line-height-tight"), fontWeight: "700" }],
      "display-3": [cssVar("font-size-display-3"), { lineHeight: cssVar("line-height-tight") }],
      "display-2": [cssVar("font-size-display-2"), { lineHeight: cssVar("line-height-tight"), fontWeight: "300" }],
      "display-1": [cssVar("font-size-display-1"), { lineHeight: cssVar("line-height-tight"), fontWeight: "300" }],
    },
    letterSpacing: {
      tight: cssVar("letter-spacing-tight"),
      normal: cssVar("letter-spacing-normal"),
      wide: cssVar("letter-spacing-wide"),
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: cssVar("color-primary-main"),
          main: cssVar("color-primary-main"),
          dark: cssVar("color-primary-dark"),
          light: cssVar("color-primary-light"),
          contrast: cssVar("color-primary-contrast"),
          hover: cssVar("color-primary-hover"),
          selected: cssVar("color-primary-selected"),
          focus: cssVar("color-primary-focus"),
        },
        secondary: {
          DEFAULT: cssVar("color-secondary-main"),
          main: cssVar("color-secondary-main"),
          dark: cssVar("color-secondary-dark"),
          light: cssVar("color-secondary-light"),
        },
        error: {
          DEFAULT: cssVar("color-error-main"),
          main: cssVar("color-error-main"),
          dark: cssVar("color-error-dark"),
          light: cssVar("color-error-light"),
        },
        warning: {
          DEFAULT: cssVar("color-warning-main"),
          main: cssVar("color-warning-main"),
          dark: cssVar("color-warning-dark"),
          light: cssVar("color-warning-light"),
        },
        info: {
          DEFAULT: cssVar("color-info-main"),
          main: cssVar("color-info-main"),
          dark: cssVar("color-info-dark"),
          light: cssVar("color-info-light"),
        },
        success: {
          DEFAULT: cssVar("color-success-main"),
          main: cssVar("color-success-main"),
          dark: cssVar("color-success-dark"),
          light: cssVar("color-success-light"),
        },
        text: {
          primary: cssVar("color-text-primary"),
          secondary: cssVar("color-text-secondary"),
          disabled: cssVar("color-text-disabled"),
          inverse: cssVar("color-text-inverse"),
          link: cssVar("color-text-link"),
        },
        surface: {
          default: cssVar("color-bg-default"),
          paper: cssVar("color-bg-paper"),
          "container-secondary": cssVar("color-bg-container-secondary"),
          "container-tertiary": cssVar("color-bg-container-tertiary"),
          underlay: cssVar("color-bg-surface-underlay"),
          overlay: cssVar("color-bg-overlay"),
        },
        border: {
          DEFAULT: cssVar("color-border-primary"),
          primary: cssVar("color-border-primary"),
          secondary: cssVar("color-border-secondary"),
          focus: cssVar("color-border-focus"),
        },
        status: {
          "inprogress-bg": cssVar("color-status-inprogress-bg"),
          "inprogress-fg": cssVar("color-status-inprogress-fg"),
          "completed-bg": cssVar("color-status-completed-bg"),
          "completed-fg": cssVar("color-status-completed-fg"),
          "blocked-bg": cssVar("color-status-blocked-bg"),
          "blocked-fg": cssVar("color-status-blocked-fg"),
          "pending-bg": cssVar("color-status-pending-bg"),
          "pending-fg": cssVar("color-status-pending-fg"),
          "notstarted-bg": cssVar("color-status-notstarted-bg"),
          "notstarted-fg": cssVar("color-status-notstarted-fg"),
          "review-bg": cssVar("color-status-review-bg"),
          "review-fg": cssVar("color-status-review-fg"),
          "approved-bg": cssVar("color-status-approved-bg"),
          "approved-fg": cssVar("color-status-approved-fg"),
          "rejected-bg": cssVar("color-status-rejected-bg"),
          "rejected-fg": cssVar("color-status-rejected-fg"),
        },
      },
      spacing: {
        none: cssVar("space-none"),
        "2xs": cssVar("space-2xs"),
        xs: cssVar("space-xs"),
        sm: cssVar("space-sm"),
        md: cssVar("space-md"),
        lg: cssVar("space-lg"),
        xl: cssVar("space-xl"),
        "2xl": cssVar("space-2xl"),
        "3xl": cssVar("space-3xl"),
        "4xl": cssVar("space-4xl"),
        "5xl": cssVar("space-5xl"),
        "6xl": cssVar("space-6xl"),
        "7xl": cssVar("space-7xl"),
        "gnb-h": cssVar("layout-gnb-height"),
        "lnb-w": cssVar("layout-lnb-width"),
        "lnb-w-collapsed": cssVar("layout-lnb-width-collapsed"),
        "collab-w": cssVar("layout-collab-drawer-width"),
      },
      borderRadius: {
        none: cssVar("radius-none"),
        xs: cssVar("radius-xs"),
        sm: cssVar("radius-sm"),
        md: cssVar("radius-md"),
        lg: cssVar("radius-lg"),
        xl: cssVar("radius-xl"),
        "2xl": cssVar("radius-2xl"),
        "3xl": cssVar("radius-3xl"),
        full: cssVar("radius-full"),
      },
      borderWidth: {
        none: cssVar("border-width-none"),
        sm: cssVar("border-width-sm"),
        DEFAULT: cssVar("border-width-md"),
        lg: cssVar("border-width-lg"),
        xl: cssVar("border-width-xl"),
      },
      boxShadow: {
        "elevation-0": cssVar("shadow-0"),
        "elevation-2": cssVar("shadow-2"),
        "elevation-16": cssVar("shadow-16"),
        "elevation-24": cssVar("shadow-24"),
        focus: cssVar("shadow-focus"),
      },
      opacity: {
        dimmed: "0.3",
        disabled: "0.5",
        overlay: "0.7",
      },
      transitionDuration: {
        instant: "50ms",
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
        slower: "600ms",
      },
      transitionTimingFunction: {
        default: cssVar("easing-default"),
        emphasized: cssVar("easing-emphasized"),
      },
      zIndex: {
        gnb: "1100",
        drawer: "1200",
        modal: "1300",
        snackbar: "1400",
        tooltip: "1500",
        "command-palette": "1600",
      },
    },
  },
  plugins: [],
};
