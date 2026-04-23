import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--sys-primary)",
        "on-primary": "var(--sys-on-primary)",
        "primary-container": "var(--sys-primary-container)",
        "on-primary-container": "var(--sys-on-primary-container)",
        secondary: "var(--sys-secondary)",
        "on-secondary": "var(--sys-on-secondary)",
        "secondary-container": "var(--sys-secondary-container)",
        "on-secondary-container": "var(--sys-on-secondary-container)",
        tertiary: "var(--sys-tertiary)",
        "on-tertiary": "var(--sys-on-tertiary)",
        "tertiary-container": "var(--sys-tertiary-container)",
        "on-tertiary-container": "var(--sys-on-tertiary-container)",
        error: "var(--sys-error)",
        "on-error": "var(--sys-on-error)",
        "error-container": "var(--sys-error-container)",
        "on-error-container": "var(--sys-on-error-container)",
        surface: "var(--sys-surface-roles-surface)",
        "on-surface": "var(--sys-surface-roles-on-surface)",
        "surface-variant": "var(--sys-surface-roles-surface-variant)",
        "on-surface-variant": "var(--sys-surface-roles-on-surface-variant)",
        outline: "var(--sys-outline-roles-outline)",
        "outline-variant": "var(--sys-outline-roles-outline-variant)",
        "surface-container": "var(--sys-surface-roles-surface-container)",
        "surface-container-low": "var(--sys-surface-roles-surface-container-low)",
        "surface-container-high": "var(--sys-surface-roles-surface-container-high)",
        "surface-container-highest": "var(--sys-surface-roles-surface-container-highest)",
        warning: "var(--ref-key-warning-key-color)",
        success: "var(--ref-key-success-key-color)",
      },
      spacing: {
        xs: "var(--sys-spacing-spacing-xs)",
        sm: "var(--sys-spacing-spacing-sm)",
        md: "var(--sys-spacing-spacing-md)",
        lg: "var(--sys-spacing-spacing-lg)",
        xl: "var(--sys-spacing-spacing-xl)",
        xxl: "var(--sys-spacing-spacing-xxl)",
      },
      borderRadius: {
        xs: "var(--sys-radius-xs)",
        sm: "var(--sys-radius-sm)",
        md: "var(--sys-radius-md)",
        lg: "var(--sys-radius-lg)",
        xl: "var(--sys-radius-xl)",
      },
      boxShadow: {
        level1: "var(--sys-elevation-3d-pnumbra)",
        level2: "var(--sys-elevation-6dp-penumbra)",
        level3: "var(--sys-elevation-8dp)",
        level4: "var(--sys-elevation-12dp-penumbra)",
      },
    },
  },
  plugins: [],
};

export default config;
