export const tokens = {
  academicNavy: "#17355F",
  reservationBlue: "#2376A8",
  signalTeal: "#148A7B",
  amber: "#D9921E",
  danger: "#B74343",
  paper: "#F4F1E8",
  surface: "#FFFFFF",
  ink: "#1D2A36"
};

export const spacing = { micro: 4, compact: 8, control: 12, card: 16, section: 24, major: 32 };
export const radius = { control: 10, card: 16, dialog: 22 };

export const themes = {
  light: {
    canvas: tokens.paper,
    surface: "#FCFBF7",
    surfaceRaised: "#FFFFFF",
    control: "#ECE8DC",
    ink: tokens.ink,
    textSecondary: "#465667",
    textMuted: "#6B7783",
    border: "rgba(23, 53, 95, 0.16)",
    borderSoft: "rgba(23, 53, 95, 0.08)",
    borderFocus: tokens.reservationBlue,
    brand: tokens.academicNavy,
    action: tokens.reservationBlue,
    success: tokens.signalTeal,
    warning: tokens.amber,
    danger: tokens.danger,
    onBrand: "#FFFFFF",
    shadow: "rgba(23, 53, 95, 0.10)"
  },
  dark: {
    canvas: "#101B29",
    surface: "#152435",
    surfaceRaised: "#1A2C41",
    control: "#0D1825",
    ink: "#F3F0E8",
    textSecondary: "#C1CBD5",
    textMuted: "#94A3B3",
    border: "rgba(234, 240, 245, 0.16)",
    borderSoft: "rgba(234, 240, 245, 0.08)",
    borderFocus: "#79B5DC",
    brand: "#E6EAF0",
    action: "#79B5DC",
    success: "#62BCAF",
    warning: "#E2B15A",
    danger: "#E08484",
    onBrand: "#112033",
    shadow: "rgba(0, 0, 0, 0.24)"
  }
};
