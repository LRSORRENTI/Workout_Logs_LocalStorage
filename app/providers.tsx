// app/providers.tsx

"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster /> {/* Include the Toaster component */}
    </ThemeProvider>
  );
}