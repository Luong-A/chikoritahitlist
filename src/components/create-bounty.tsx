import { useTRPC } from "@/lib/trpc-client";
import { useMutation } from "@tanstack/react-query";
import { Image, Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export const CreateBounty: React.FC = () => {
  const trpc = useTRPC();
  const createBounty = useMutation(trpc.createBounty.mutationOptions());
  const [filename, setFilename] = useState<string>("");
  const [offender, setOffender] = useState<string>("");
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed right-10 bottom-10  
flex justify-center text-2xl shadow-lg  rounded-full 
h-12 w-12 items-center bg-kprimarylight text-black hover:bg-ksecondarydark border-0"
        >
          <Plus className="stroke-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md focus:outline-lime-200 flex-col left-1/2 top-1/2 -translate-1/2 w-lg h-md fixed p-10 flex justify-center justify-items-center bg-kprimarylight text-themetext-800  rounded-3xl shadow-md border-0">
        <DialogHeader>
          <DialogTitle>Official Chikorita Form:</DialogTitle>
        </DialogHeader>
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

            setFilename("");
            setOffender("");
            setTimestamp(null);
            setMessage("");
          }}
          className="gap-6 grid grid-cols-3 mt-4"
        >
          {/* Thinking about sanitizing */}
          <label htmlFor="offender">Offender:</label>
          <input
            className="focus:border-b-2 col-span-2 outline-0 ring-0 hover:bg-white/10 focus:bg-white/20 not-focus:mb-[1px] p-1 rounded border-b w-full"
            id="offender"
            onChange={(e) => setOffender(e.target.value)}
            value={offender}
          ></input>

          <p>Image:</p>
          <>
            <label
              htmlFor="image"
              className="rounded border px-1 py-1 col-span-2 flex gap-1 hover:bg-white/10 focus:bg-white/20 cursor-pointer"
            >
              <Image />
              {filename ? filename : "Upload Image"}
            </label>
            <input
              className="hidden"
              id="image"
              type="file"
              placeholder="balls"
              onChange={(e) => {
                const currName = e.target.files?.[0]?.name;
                setFilename(currName || "");
              }}
            />
          </>

          <label htmlFor="timestamp">Timestamp:</label>
          <input
            className="hover:bg-white/10 col-span-2 cursor-text focus:bg-white/20 outline-0 ring-0 p-1 rounded border"
            id="timestamp"
            type="date"
            onChange={(e) => setTimestamp(new Date(e.target.value))}
            value={timestamp ? timestamp.toISOString().split("T")[0] : ""}
          ></input>
          <label htmlFor="message">Message:</label>

          <input
            className="focus:border-b-2 col-span-2 outline-0 ring-0 hover:bg-white/10 focus:bg-white/20 not-focus:mb-[1px] p-1 rounded border-b w-full"
            id="message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></input>

          <div className="col-span-3" />
          <div className="col-span-2 h-2" />

          <button
            className="border rounded hover:bg-white/10 focus:bg-white/20 px-2 py-1 disabled:bg-gray-600/20 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            type="submit"
            disabled={!filename || !offender || !timestamp}
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
