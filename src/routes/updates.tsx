import { AppShell } from "@/components/app-shell";
import { UpdatePost } from "@/components/update-post";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/updates")({
  component: UpdateComponent,
});

function UpdateComponent() {
  return (
    <AppShell
      title="Updates"
      desc="What changed, what improved, and what was removed."
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-3xl border border-kprimarylight/40 bg-white/80 p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold">Updates</h1>
          <p className="mt-2 text-muted-foreground">
            What has happened to Chikorita Hit List?
          </p>
        </div>

        <UpdatePost
          date={new Date("2026-06-28")}
          additions={[
            "Google sign-in support",
            "Sidebar navigation shell",
            "Dedicated profile page",
            "This page of course"
          ]}
          changes={[
            "Home screen has been changed to be a landing page",
            "Added routing for different parts of the previous home page",
          ]}
          removals={["None"]}
          notes="Since I really didn't want to remove the betterauth, 
          I decided to add more things that made it make sense to continue with better auth. 
          This also happens to fall in line with the new feature I plan on additing, pickems, as well as
          a thematic points system to make the Bounty and HitList names make much more sense as part of the site. "
        />
        <UpdatePost
          date={new Date("2026-06-29")}
          additions={[
            "Filters for Leaderboard and Bounty for 2026",
            "Getting Started Page",
            "Dedicated profile page",
          ]}
          changes={[
            "None"
          ]}
          removals={["None"]}
          notes="Not much for this update but I'm about to add the pickems. 
          After seeing two updates together i think a visual rework for this page is needed. 
          There is nothing right now in getting started but soon I'll populate these. "
        />
      </div>
    </AppShell>
  );
}
