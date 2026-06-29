import { createFileRoute } from '@tanstack/react-router'
import { SeasonManager } from "@/components/season-manager";
import { AppShell } from '@/components/app-shell';



export const Route = createFileRoute('/gettingstarted')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <AppShell title="Getting Started" desc="We all start from somewhere">
      <div className="justify-center">
        <h1 className="text-center">YO IDK WHAT TO PUT</h1>
        <section>Leaderbard</section>
        <section>Bounty</section>
        <section>Pickems</section>
      </div>
    </AppShell>
  );
}
