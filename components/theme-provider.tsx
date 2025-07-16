"use client"
import { createContext, useCallback, useEffect, useState } from "react"
import type React from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    (typeof window !== "undefined" && (localStorage.getItem("theme") as Theme | null)) || "system",
  )

  // Apply class to <html>
  const applyTheme = useCallback((value: Theme) => {
    const root = document.documentElement
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = value === "dark" || (value === "system" && prefersDark)

    if (shouldUseDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  const setTheme = useCallback(
    (value: Theme) => {
      setThemeState(value)
      localStorage.setItem("theme", value)
      applyTheme(value)
    },
    [applyTheme],
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
