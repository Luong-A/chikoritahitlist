import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { useTRPC } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import '../components/timer';
import { BannerTimer } from "@/components/BannerTimer";




export const Route = createFileRoute("/pickems2026")({
  component: PickemsPage,
});

function PickemsPage() {
  const trpc = useTRPC();
  const [poolId, setPoolId] = useState<string | undefined>(undefined);
  const [localSelected, setLocalSelected] = useState<Record<string, string>>(
    {},
  );

  const poolsQuery = useQuery(trpc.getPickemPools.queryOptions());

  useEffect(() => {
    if (!poolId && poolsQuery.data?.length) {
      setPoolId(poolsQuery.data[0].id);
    }
  }, [poolId, poolsQuery.data]);

  const matchupsQuery = useQuery({
    ...trpc.getPickemMatchups.queryOptions({ poolId: poolId ?? "" }),
    enabled: Boolean(poolId),
  });

  const entryQuery = useQuery({
    ...trpc.getMyPickemEntry.queryOptions({ poolId: poolId ?? "" }),
    enabled: Boolean(poolId),
  });

  useEffect(() => {
    if (entryQuery.data?.picks) {
      setLocalSelected(
        Object.fromEntries(
          entryQuery.data.picks.map((pick) => [
            pick.matchupId,
            pick.selectedOption,
          ]),
        ),
      );
    }
  }, [entryQuery.data]);

  useEffect(() => {
    import("@/components/timer");
  }, []);

  const submitPick = useMutation(trpc.submitPick.mutationOptions());

  const selectedByMatchup = useMemo(() => {
    const map = new Map<string, string>();
    entryQuery.data?.picks?.forEach((pick) => {
      map.set(pick.matchupId, pick.selectedOption);
    });
    Object.entries(localSelected).forEach(([matchupId, option]) => {
      map.set(matchupId, option);
    });
    return map;
  }, [entryQuery.data, localSelected]);

  const selectedCount = entryQuery.data?.picks?.length ?? 0;
  const totalMatchups = matchupsQuery.data?.length ?? 0;
  const selectedPool = poolsQuery.data?.find((pool) => pool.id === poolId);

  return (
    <AppShell title="Pickems 2026" desc="Do you see the future?">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 bg-ksecondarydark/70 rounded-[2rem]">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] ">
          <section className="rounded-[2rem] border border-white/10 bg-ksecondarydark/40  p-6 shadow-[0_20px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl">
            <div className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center rounded-full border border-white/10 bg-transparent p-8 shadow-[inset_0_0_120px_rgba(255,255,255,0.15)]">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,oklch(86.94% 0.042 116.18),transparent_38%)]" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_bottom,oklch(78.91% 0.058 118.63),transparent_45%)] opacity-80" />
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-ksecondarylight">
                  Crystal Ball
                </p>
                <h1 className="max-w-52 text-3xl font-semibold text-white">
                  {selectedPool?.name ?? "Choose your pool"}
                </h1>
                <p className="text-sm text-ksecondarylight">
                  {selectedCount}/{totalMatchups} picks recorded
                </p>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-ksecondarylight">
                  {selectedPool ? "Locked In" : "Waiting for a pool"}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ksecondarylight">
                Pools
              </p>
              <div className="space-y-2">
                {poolsQuery.data?.map((pool) => (
                  <button
                    key={pool.id}
                    type="button"
                    onClick={() => setPoolId(pool.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-500 ${
                      pool.id === poolId
                        ? "border-primary bg-primary/15 text-ksecondarylight"
                        : "border-white/10 bg-[oklch(86.94% 0.042 116.18)] transparent_45%  text-ksecondarylight hover:border-white/20 hover:bg-ksecondarydark"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{pool.name}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-ksecondarylight">
                        {new Date(pool.startsAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ksecondarylight">
                      Ends {new Date(pool.endsAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
                {!poolsQuery.isLoading && !poolsQuery.data?.length ? (
                  <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm text-ksecondarylight">
                    No active pickem pools available.
                  </p>
                ) : null}
              </div>
            </div>
            <BannerTimer
              title="Pickems End"
              startDate="2025-06-04T22:00:00-05:00"
              endDate="2026-08-24T22:00:00-05:00"
            ></BannerTimer>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.1)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-ksecondarylight">
                    Predicting For:
                  </p>
                  <h2 className="text-2xl font-semibold text-ksecondarylight">
                    {selectedPool?.name ?? "Pickems 2026"}
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-ksecondarylight">
                    <span>{selectedCount} selected</span>
                    <span className="text-ksecondarylight">|</span>
                    <span>{totalMatchups} total</span>
                  </div>

                  <Progress value={(selectedCount / totalMatchups) * 100} />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {matchupsQuery.isLoading ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-ksecondarylight">
                  Loading matchups...
                </div>
              ) : (matchupsQuery.data?.length && (selectedPool?.endsAt! > new Date())) ? (
                matchupsQuery.data.map((matchup) => {
                  const selectedOption = selectedByMatchup.get(matchup.id);
                  return (
                    <div
                      key={matchup.id}
                      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          {matchup.teamA.length > 0 ? (
                            <p className="text-sm uppercase tracking-[0.24em] text-ksecondarylight">
                              {matchup.teamA} vs {matchup.teamB}
                            </p>
                          ) : null}

                          <h3 className="text-xl font-semibold text-ksecondarylight">
                            {matchup.question}
                          </h3>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-ksecondarylight">
                          {new Date(matchup.startsAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {matchup.options.map((option) => (
                          <Button
                            key={option}
                            variant={
                              option === selectedOption
                                ? "secondary"
                                : "outline"
                            }
                            size="default"
                            className={`w-full justify-start ${
                              option === selectedOption
                                ? "border-black bg-ksecondarydark/5"
                                : "bg-kprimarylight/95 border-dashed"
                            }`}
                            onClick={() => {
                              setLocalSelected((prev) => ({
                                ...prev,
                                [matchup.id]: option,
                              }));
                              submitPick.mutate({
                                poolId: poolId!,
                                matchupId: matchup.id,
                                selectedOption: option,
                              });
                              toast.success("Your choice has been saved!", {
                                position: "bottom-right",
                                className: "!bg-kprimarylight",
                                description:
                                  "You may continue to do your pickems. ",
                                duration: 1500,
                              });
                            }}
                            disabled={!poolId}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-ksecondarylight">
                  Choose a pool to see matchups.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
