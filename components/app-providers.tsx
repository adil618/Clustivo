import React from "react"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "./ui/tooltip"

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </>
  )
}

export default AppProviders
