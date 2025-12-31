import React, { createContext, useContext, useState, ReactNode } from "react";
import { Colors } from "./theme"; // your existing colors

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  colors: typeof Colors.light;
  toggleTheme: () => void; 
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: Colors.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light" ? Colors.light : Colors.dark;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
