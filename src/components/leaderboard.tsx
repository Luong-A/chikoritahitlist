import { useTRPC } from "@/lib/trpc-client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const Leaderboard: React.FC = () => {
  const trpc = useTRPC();
  const leaderboardData = useQuery(trpc.getLeaderboard.queryOptions());
  return (
    <div className="flex flex-col justify-center w-2/5">
      <table className="table-auto mt-5 text-2xl">
        <thead>
          <tr>
            <th className="text-left pl-2">Name</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.data?.map(({ count, name }) => (
            <tr className="m-3 p-3 " key={name}>
              <td className="p-2 m-3">{name}</td>
              <td className=" p-2 m-3 justify-items-center text-center">
                {count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="my-5 w-full"></hr>
    </div>
  );
};
