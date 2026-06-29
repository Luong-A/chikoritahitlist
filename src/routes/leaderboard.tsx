import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import { Leaderboard } from "@/components/leaderboard";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const trpc = useTRPC();
  const leaderboardDataQuery = useQuery(trpc.getLeaderboard.queryOptions());

  return (
    <AppShell
      title="Leaderboard"
      desc="See who is currently leading the hit list."
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Leaderboard data={leaderboardDataQuery.data ?? []} />
      </div>
    </AppShell>
  );
}
