import { Link, createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "@/lib/trpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signInOptions } from "@/lib/auth-client";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const trpc = useTRPC();
  const userData = useQuery(trpc.getUser.queryOptions());
  const signIn = useMutation(signInOptions);
  const validateTOTP = useMutation(trpc.getTOTP.mutationOptions());
  const [totp, setTotp] = useState(false);

  if (userData.isLoading) {
    return (
      <AppShell title="Home" desc="Loading your account...">
        <p>Loading...</p>
      </AppShell>
    );
  }

  if (!userData.data) {
    return (
      <div className="flex items-center justify-center flex-col gap-4">
        <h1 className="mt-5 pt-4 text-5xl text-kbackgrounddark font-bold">
          Chikorita Hit List
        </h1>
        <img src="chikorita.png" />
        <button
          className="bg-amber-500 rounded-2xl border-b p-2 px-12 cursor-pointer text-white text-2xl font-bold active:border-0 active:translate-y-1 transition-all duration-500"
          onClick={() => signIn.mutateAsync()}
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting...");

    // Create FormData object from the targeted form
    const formData = new FormData(event.currentTarget);

    // Pull the input value using its 'name' attribute
    const userInputValue = String(formData.get("totp") ?? "").trim();

    const validatedTOTP = await validateTOTP.mutateAsync({
      userToken: userInputValue,
    });
    if (validatedTOTP) {
      setTotp(true);
      return;
    }
    console.log("Invalid Token somehow?");
  };

  if (!totp) {
    return (
      <div className="flex items-center justify-center flex-col gap-4">
        <h1 className="mt-5 pt-4 text-5xl text-kbackgrounddark font-bold">
          Chikorita Hit List
        </h1>
        <img src="chikorita.png" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="totp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Enter Totp"
            className="bg-amber-500 rounded-2xl border-b p-2 px-12 cursor-pointer text-white text-2xl font-bold active:border-0 active:translate-y-1 transition-all duration-500"
          ></input>
        </form>
      </div>
    );
  }

  return (
    <AppShell title="Home" desc="Choose where you want to go next.">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to="/gettingstarted"
          className="rounded-3xl border border-kprimarylight/40 bg-white/70 p-8 shadow-sm hover:-translate-y-0.5 hover:bg-ksecondarydark transition-all duration-500"
        >
          <h1 className="text-4xl font-bold">Getting Started</h1>
          <p className="mt-2 text-muted-foreground">
            Click here if you have no idea what you are doing
          </p>
        </Link>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/updates"
            className="rounded-2xl border border-kprimarylight/40 bg-white p-6 shadow-sm transition hover:bg-ksecondarydark hover:-translate-y-0.5 duration-500"
          >
            <h3 className="text-xl font-semibold">Learn What's New</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See what's changed.
            </p>
          </Link>

          <Link
            to="/pickems2026"
            className="rounded-2xl border border-kprimarylight/40 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-ksecondarydark duration-500"
          >
            <h3 className="text-xl font-semibold">Pickems</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Do your pickems!
            </p>
          </Link>

          <Link
            to="/leaderboard"
            className="rounded-2xl border border-kprimarylight/40 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-ksecondarydark duration-500"
          >
            <h3 className="text-xl font-semibold">Leaderboard</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Jump straight into the leaderboard.
            </p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
