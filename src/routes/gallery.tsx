import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import { Bounty } from "@/components/bounty";
import { CreateBounty } from "@/components/create-bounty";
import { AppShell } from "@/components/app-shell";
import { SeasonTabs } from "@/components/season-tabs";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  const trpc = useTRPC();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined,
  );

  const bountyDataQuery = useQuery(
    trpc.getBounties.queryOptions({ seasonId: selectedSeasonId }),
  );

  const onNewBounty = () => {
    bountyDataQuery.refetch();
  };

  return (
    <AppShell title="Hit List" desc="Browse the latest bounties.">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-2xl border border-kprimarylight/40 bg-ksecondarydark/20 p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-600">
            Filter by Season
          </p>
          <SeasonTabs
            selectedSeasonId={selectedSeasonId}
            onSeasonChange={setSelectedSeasonId}
          />
        </div>

        <div className="grid grid-cols-1 gap-y-12 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {bountyDataQuery.data?.map((bounty) => (
            <Bounty
              image={bounty.image}
              date={bounty.date}
              offenders={bounty.persons.join(", ")}
              msg={bounty.msg}
              key={bounty.id}
            />
          ))}
        </div>
        <CreateBounty onNewBounty={onNewBounty} />
      </div>
    </AppShell>
  );
}
