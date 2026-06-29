import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export function SeasonManager() {
  const trpc = useTRPC();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const seasonsQuery = useQuery(trpc.getSeasons.queryOptions());
  const createSeasonMutation = useMutation(trpc.createSeason.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      toast.error("Start date must be before end date");
      return;
    }

    try {
      await createSeasonMutation.mutateAsync({
        name,
        startDate: start,
        endDate: end,
      });
      setName("");
      setStartDate("");
      setEndDate("");
      toast.success("Season created!");
      seasonsQuery.refetch();
    } catch (err) {
      toast.error("Failed to create season");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-kprimarylight/40 bg-white/70 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Add Season</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Season Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 2025 Aug - 2026 May"
              disabled={createSeasonMutation.isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={createSeasonMutation.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={createSeasonMutation.isPending}
              />
            </div>
          </div>
          <Button disabled={createSeasonMutation.isPending}>
            {createSeasonMutation.isPending ? "Creating..." : "Create Season"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-kprimarylight/40 bg-white/70 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Existing Seasons</h2>
        {seasonsQuery.isLoading ? (
          <p className="text-slate-600">Loading seasons...</p>
        ) : seasonsQuery.data && seasonsQuery.data.length > 0 ? (
          <div className="space-y-2">
            {seasonsQuery.data.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-slate-600">
                  {new Date(s.startDate).toLocaleDateString()} -{" "}
                  {new Date(s.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No seasons yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}
