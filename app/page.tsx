import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  UsersIcon,
  TrendingUpIcon,
  DollarSignIcon,
  ActivityIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    description: "from last month",
    icon: DollarSignIcon,
  },
  {
    title: "Active Users",
    value: "+2,350",
    change: "+180.1%",
    trend: "up",
    description: "from last month",
    icon: UsersIcon,
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    description: "from last month",
    icon: TrendingUpIcon,
  },
  {
    title: "Active Now",
    value: "+573",
    change: "-201",
    trend: "down",
    description: "since last hour",
    icon: ActivityIcon,
  },
]

const recentActivity = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
  },
]

export default function Page() {
  return (
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* ── Header ── */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Clustivo</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/*Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here&apos;s an overview of your workspace.
            </p>
          </div>

          {/* ── Stats Cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              const isUp = stat.trend === "up"
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      {isUp ? (
                        <ArrowUpRightIcon className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRightIcon className="h-3 w-3 text-rose-500" />
                      )}
                      <span
                        className={
                          isUp ? "text-emerald-500" : "text-rose-500"
                        }
                      >
                        {stat.change}
                      </span>{" "}
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* ── Bottom Row ── */}
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Chart placeholder */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Monthly revenue for this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-56 items-end gap-2">
                  {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 100].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-primary/80 transition-all hover:bg-primary"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
                    (m) => <span key={m}>{m}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((item) => (
                    <div
                      key={item.email}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar fallback */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-500">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}
