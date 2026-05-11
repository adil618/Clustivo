import { redirect } from "next/navigation"

// Redirect root "/" to the admin dashboard.
// All admin pages live under the (admin) layout group so they share
// the same sidebar/layout — no full page remount on navigation.
export default function RootPage() {
  redirect("/admin/dashboard")
}
