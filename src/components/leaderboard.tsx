import { useTRPC } from "@/lib/trpc-client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const Leaderboard: React.FC = () => {
  const trpc = useTRPC();
  const leaderboardData = useQuery(trpc.getLeaderboard.queryOptions());
  return (
    <div className="flex flex-col justify-center">
      <h3 className="flex justify-center text-5xl text-ktextlight p-3 ">
        Leaderboard
      </h3>
      <table className="table-auto mt-5 text-2xl">
        <tr>
          <th className="justify-items-start">Name</th>
          <th>Count</th>
        </tr>
        {leaderboardData.data?.map(({ count, name }) => (
          <tr className="m-3 p-3 ">
            <td className="p-2 m-3">{name}</td>
            <td className=" p-2 m-3 justify-items-center text-center">
              {count}
            </td>
          </tr>
        ))}
      </table>
      <hr className="m-5"></hr>
    </div>
  );
};
