import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" desc="A placeholder for future settings.">
      <div className="rounded-2xl border border-dashed border-kprimarylight/50 bg-white/70 p-8 text-center">
        <h3 className="text-xl font-semibold">Settings coming soon maybe</h3>
        <p className="mt-2 text-muted-foreground">
          bleh bleh bleh
        </p>
      </div>
    </AppShell>
  );
}
