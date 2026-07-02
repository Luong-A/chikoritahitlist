import { TRPCRouter } from "@/server/trpc/routes";
import { inferRouterOutputs } from "@trpc/server";
import React from "react";

export const Leaderboard: React.FC<{
  data: inferRouterOutputs<TRPCRouter>["getLeaderboard"];
}> = ({ data }) => {
  const topThree = data?.slice(0, 3) ?? [];
  const remainder = data?.slice(3) ?? [];

  const podiumItems = [
    topThree[1] ?? null,
    topThree[0] ?? null,
    topThree[2] ?? null,
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-kaccentdark/30">
              Leaderboard
            </p>
            <h2 className="text-3xl font-semibold text-ksecondarylight">
              Podium
            </h2>
          </div>
          <div className="rounded-3xl bg-ksecondarydark/40 px-4 py-2 text-sm text-ksecondarylight shadow-inner">
            {data?.length ?? 0} Total Targets
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_1fr]">
          {podiumItems.map((player, index) => {
            if (!player) {
              return (
                <div
                  key={index}
                  className="rounded-[2rem] border border-dashed border-white/10 bg-ksecondarydark/20 p-6 text-center text-slate-500"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-ksecondarylight">
                    {index === 1 ? "Winner" : index === 0 ? "Second" : "Third"}
                  </p>
                  <p className="mt-4 text-xl font-semibold text-ksecondarylight">TBD</p>
                </div>
              );
            }

            const isWinner = index === 1;
            const isSecond = index === 0;
            const isThird = index === 2;
            const accent = isWinner
              ? "from-amber-400/15 via-transparent to-transparent"
              : isSecond
                ? "from-slate-400/50 via-transparent to-transparent"
                : "from-amber-700/10 via-transparent to-transparent";
            const positionLabel = isWinner ? "1st" : isSecond ? "2nd" : "3rd";

            return (
              <div
                key={player.name}
                className={`relative overflow-hidden rounded-[2rem] border border-ksecondarylight bg-ksecondarydark/60 p-6 text-amber-500 shadow-lg shadow-ksecondarydark`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-24 bg-linear-to-b ${accent}`}
                />
                <div className="relative flex h-full flex-col justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-ksecondarylight">
                      {positionLabel} place
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold  text-center text-ksecondarylight">
                      {player.name}
                    </h3>
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/20 px-4 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.32em] text-ksecondarylight">
                      Hits Collected
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-ksecondarylight">
                      {player.count}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-ksecondarydark/60 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Full ranking
            </p>
            <h3 className="text-xl font-semibold text-ksecondarylight">Runners Up</h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/50 px-3 py-1 text-xs uppercase tracking-[0.3em] text-ksecondarylight">
            {remainder.length} more
          </div>
        </div>

        <div className="space-y-3">
          {remainder.length ? (
            remainder.map((player, index) => (
              <div
                key={player.name}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/50 px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-ksecondarydark/90 text-sm font-semibold text-ksecondarylight">
                    {index + 4}
                  </div>
                  <div>
                    <p className="font-semibold text-ksecondarylight">
                      {player.name}
                    </p>
                    <p className="text-sm text-ksecondarylight">
                      Rank {index + 4}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-ksecondarydark/90 px-4 py-2 text-sm text-ksecondarylight">
                  {player.count} hits
                </div>
              </div>
            ))
          ) : (
            //TBD
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/30 p-8 text-center text-ksecondarylight">
              There have not been enough bounties to determine Runners Up. Keep
              hunting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
