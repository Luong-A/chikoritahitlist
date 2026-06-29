import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";

type SeasonTabsProps = {
  selectedSeasonId: string | undefined;
  onSeasonChange: (seasonId: string | undefined) => void;
};

export function SeasonTabs({
  selectedSeasonId,
  onSeasonChange,
}: SeasonTabsProps) {
  const trpc = useTRPC();
  const seasons = useQuery(trpc.getSeasons.queryOptions());

  if (seasons.isLoading) {
    return <div className="h-10 animate-pulse bg-slate-200 rounded-lg" />;
  }

  if (!seasons.data || seasons.data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSeasonChange(undefined)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          selectedSeasonId === undefined
            ? "bg-kprimarylight text-white"
            : "border border-kprimarylight/40 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        All Time
      </button>

      {seasons.data.map((s) => (
        <button
          key={s.id}
          onClick={() => onSeasonChange(s.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedSeasonId === s.id
              ? "bg-kprimarylight text-white"
              : "border border-kprimarylight/40 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
