"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="athlo-theme"
      themes={["dark", "light"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, setTheme, systemTheme, themes } = require("next-themes").useTheme();
  
  return {
    theme,
    setTheme,
    systemTheme,
    themes,
    isDark: theme === "dark" || (theme === "system" && systemTheme === "dark"),
    isLight: theme === "light" || (theme === "system" && systemTheme === "light"),
  };
}