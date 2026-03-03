import { TRPCRouter } from "@/server/trpc/routes";
import { inferRouterOutputs } from "@trpc/server";
import React from "react";

export const Leaderboard: React.FC<{
  data: inferRouterOutputs<TRPCRouter>["getLeaderboard"];
}> = ({ data }) => {
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
          {data?.map(({ count, name }) => (
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
