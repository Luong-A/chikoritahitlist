import { useTRPC, useTRPCClient } from "@/lib/trpc-client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

export const CreateBounty: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const createBounty = useMutation(trpc.createBounty.mutationOptions());

  return (
    <>
      {isOpen && (
        <div className="bg-amber-300 w-[800px] h-[800px] fixed left-0.5 top-0.5">
          Do smth
          <button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            close
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const offender = e.currentTarget.offender.value;
              const image = e.currentTarget.image.files[0];
              const time = e.currentTarget.timestamp.value;
              console.log("offender: image: time:", offender, image, time);
             const formdata = new FormData();
             formdata.append("offender",offender);
             formdata.append("image",image);
             formdata.append("timestamp",time);
             console.log(formdata);
              createBounty.mutate(formdata);
            }}
            className="flex-col flex gap-2"
          >
            <label htmlFor="offender">Offender:</label>
            <input id="offender"></input>
            <label htmlFor="image">image</label>
            <input id="image" type="file"></input>
            <label htmlFor="timestamp">timestamp</label>
            <input id="timestamp" type="date"></input>
            <button type="submit">button with type submit</button>
          </form>
        </div>
      )}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="fixed right-10 bottom-10  
flex justify-center text-2xl shadow-lg  rounded-full 
h-12 w-12 items-center bg-kprimarylight text-black dark:bg-kprimarydark dark:text-black hover:bg-ksecondarydark"
      >
        <Plus />
      </button>

      <button>HELLO</button>
    </>
  );
};
