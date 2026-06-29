import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import { signOutOptions } from "@/lib/auth-client";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const trpc = useTRPC();
  const userData = useQuery(trpc.getUser.queryOptions());
  const signOut = useMutation(signOutOptions);
  const user = userData.data;

  return (
    <AppShell title="My Profile" desc="Manage your profile and account.">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rounded-3xl border border-kprimarylight/40 bg-white/80 p-8 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Profile"}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kprimarylight text-xl font-semibold">
                {(user?.name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">
                {user?.name ?? "Guest"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.email ?? "Not signed in"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-kprimarylight/40 bg-kbackgroundlight/70 p-6">
            <h3 className="font-semibold">Profile details</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Adding more things like points, pickems, and other account specific things.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-kprimarylight"
              onClick={() => signOut.mutateAsync()}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
