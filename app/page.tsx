import { AppSidebar } from "@/components/app-sidebar"
import { NavMain } from "@/components/nav-main"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
            <SidebarTrigger />
          </TooltipProvider>
        </SidebarProvider>
        <Separator />
        <NavMain items={[]} />
        <Separator />
      </div>
    </div>
  )
}
