import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useTRPC } from "@/lib/trpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signInOptions } from "@/lib/auth-client";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const trpc = useTRPC();
  const userData = useQuery(trpc.getUser.queryOptions());

  const signIn = useMutation(signInOptions);

  if (userData.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData.data) {
    return (
      <div className="text-center ">
        <h1 className="mt-5 pt-4 text-5xl">Chikorita HitList</h1>
        <button
          className="bg-amber-500 rounded-2xl border-b p-2 px-3"
          onClick={() => signIn.mutateAsync()}
        >
          Sign In{" "}
        </button>
      </div>
    );
  }
  return (
    <div>
      <h1 className="flex justify-center text-7xl m-2 "> Hit List</h1>
      <h1 className="flex justify-center text-5xl m-2">Leaderboard</h1>
      <h1 className="flex justify-center text-5xl m-2">Add Yours</h1>

      <button
        className="absolute right-10 bottom-10  
flex justify-center text-2xl shadow-lg  rounded-full 
h-12 w-12 items-center"
      >
        <Plus />
      </button>
    </div>
  );
}
