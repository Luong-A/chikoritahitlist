import { useTRPC } from "@/lib/trpc-client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const Leaderboard: React.FC<{name: string,count: number}> = ({
    
}) => {
    const trpc = useTRPC();
    const leaderboardData = useQuery(trpc.getLeaderboard.queryOptions());
    return (
      <div className="flex flex-col justify-center">
        <h3 className="flex justify-center text-5xl text-ktextlight dark:text-ktextdark">
          Leaderboard
        </h3>
        
          {leaderboardData.data?.map(({ count, name }) => (
            <div className="  self-center border flex justify-between justify-items-center  p-1 text-xl m-6 gap-5 w-2xl ">
              <p>{name}</p>
              <p>{count}</p>
            </div>
          ))}
        
      </div>
    );
    




};
