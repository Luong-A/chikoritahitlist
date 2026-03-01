import { useTRPC, useTRPCClient } from "@/lib/trpc-client";
import { useMutation } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export const CreateBounty: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const createBounty = useMutation(trpc.createBounty.mutationOptions());

  return (
    <>
      {isOpen && (
        <div
          className={`w-screen h-screen transition-colors ${isOpen ? "bg-black/50" : "bg-transparent"} fixed top-0 left-0`}
        >
          <div className=" focus:outline-lime-200 flex-col w-lg h-md fixed p-10 top-80  right-125  flex justify-center justify-items-center border bg-kprimarylight text-themetext-800 dark:bg-kprimarydark rounded-3xl shadow-md  dark:shadow-darkprimary-800 ">
            <button
              className="hover:text-ksecondarylight justify-center justify-items-center flex pb-2 select-none"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <X className="select-none" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const offender = e.currentTarget.offender.value;
                const image = e.currentTarget.image.files[0];
                const time = e.currentTarget.timestamp.value;
                const message = e.currentTarget.message.value;
                console.log("offender: image: time:", offender, image, time);
                const formdata = new FormData();
                formdata.append("offender", offender);
                formdata.append("image", image);
                formdata.append("timestamp", time);
                formdata.append("message", message);
                console.log(formdata);
                createBounty.mutate(formdata);
              }}
              className="flex-col flex gap-2"
            >
              {/* Thinking about sanitizing */}
              <div className="flex p-0.5 gap-2 m-2">
                <label htmlFor="offender">Offender:</label>
                <input
                  className="focus:outline-1 focus:outline-kaccentlight rounded border-b w-full"
                  id="offender"
                ></input>
              </div>
              <div className="flex justify-between m-2">
                <label htmlFor="image">Image:</label>
                <input
                  className="hover:text-kaccentlight"
                  id="image"
                  type="file"
                ></input>
              </div>
              <div className="flex p-0.5 gap-2 m-2">
                <label htmlFor="timestamp">Timestamp:</label>
                <input
                  className="hover:text-kaccentlight"
                  id="timestamp"
                  type="date"
                ></input>
              </div>
              <div className="flex p-0.5 gap-2 m-2">
                <label htmlFor="message">Message:</label>

                <input
                  className="hover:text-kaccentlight focus:outline-1 focus:outline-kaccentlight  rounded border-b w-full"
                  id="message"
                ></input>
              </div>

              <button
                className="border rounded hover:text-kaccentlight "
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
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

      <button></button>
    </>
  );
};
