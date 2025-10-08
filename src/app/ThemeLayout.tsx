"use client";
import { ThemeProvider } from "next-themes";

import { useTheme } from "next-themes";
import React from "react";

export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="px-4 py-2 rounded-lg shadow font-semibold transition bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
        aria-label="Changer le thème"
      >
        {resolvedTheme === "dark" ? "☀️ Mode clair" : "🌙 Mode sombre"}
      </button>
    </div>
  );
}
