import { createFileRoute } from '@tanstack/react-router'
import { SeasonManager } from "@/components/season-manager";
import { AppShell } from '@/components/app-shell';



export const Route = createFileRoute('/gettingstarted')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
  <AppShell title="Hit List" desc="Browse the latest bounties."
  >
    <div>
      <SeasonManager></SeasonManager>
    </div>
  </AppShell>)
  ;
}
