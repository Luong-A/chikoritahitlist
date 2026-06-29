import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


/**
 * Implement later - featured things
 */
const featuredItems = [
    {title: "2026 Hit List Pick'ems", to: "/pickems2026"},
    {title: "What's New?", to: "/updates"}
]

const navItems = [
  { title: "Home", to: "/" },
  { title: "Leaderboard", to: "/leaderboard" },
  { title: "Gallery", to: "/gallery" },
  { title: "My Profile", to: "/profile" },
];

export function AppSidebar() {
  const trpc = useTRPC();
  const userData = useQuery(trpc.getUser.queryOptions());
  const user = userData.data;

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4 bg-kbackgroundlight">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name ?? "Profile"}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kprimarylight font-semibold">
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {user?.name ?? "Guest"}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {user ? "User Account" : "Sign in to continue"}
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-kbackgroundlight">
        <SidebarGroup>
          <SidebarGroupLabel>Featured</SidebarGroupLabel>
          <SidebarMenu>
            {featuredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-kprimarylight">
                  <Link to={item.to}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="hover:bg-kprimarylight">
                  <Link to={item.to}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 text-sm text-muted-foreground bg-kprimarylight">
        For Gaymers
      </SidebarFooter>
    </Sidebar>
  );
}
