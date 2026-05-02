export const colors = {
  background: "#0B1220",
  surface: "#131C2E",
  accent: "#38BDF8",
  textPrimary: "#F8FAFC",
  textMuted: "#94A3B8",
} as const;

export type ColorToken = keyof typeof colors;
