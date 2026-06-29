import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import { Leaderboard } from "@/components/leaderboard";
import { AppShell } from "@/components/app-shell";
import { SeasonTabs } from "@/components/season-tabs";
import { useState } from "react";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const trpc = useTRPC();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined,
  );

  const leaderboardDataQuery = useQuery(
    trpc.getLeaderboard.queryOptions({ seasonId: selectedSeasonId }),
  );

  return (
    <AppShell
      title="Leaderboard"
      desc="See who is currently leading the hit list."
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-2xl border border-kprimarylight/40 bg-ksecondarydark/20 p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-600">
            Filter by Season
          </p>
          <SeasonTabs
            selectedSeasonId={selectedSeasonId}
            onSeasonChange={setSelectedSeasonId}
          />
        </div>

        <Leaderboard data={leaderboardDataQuery.data ?? []} />
      </div>
    </AppShell>
  );
}
