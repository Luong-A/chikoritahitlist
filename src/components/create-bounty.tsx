import { useTRPC } from "@/lib/trpc-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image, Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "./ui/label";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { z } from "zod";

export const bountyFormSchema = z.object({
  offenders: z
    .array(z.object({ name: z.string(), id: z.string() }))
    .nonempty("At least one offender is required."),
  image: z
    .file()
    .refine((file) => file instanceof File, "Image is required.")
    .refine((file) => file.type.startsWith("image/"), "File must be an image."),
  created: z
    .date()
    .refine((date) => date <= new Date(), "Date cannot be in the future."),
  message: z.string().max(255, "Message must be at most 255 characters."),
});

export const CreateBounty: React.FC<{ onNewBounty: () => void }> = ({
  onNewBounty,
}) => {
  const trpc = useTRPC();
  const createBounty = useMutation(trpc.createBounty.mutationOptions());
  const uploadImage = useMutation(trpc.uploadImage.mutationOptions());
  const createOffender = useMutation(trpc.createOffender.mutationOptions());
  const offendersQuery = useQuery(trpc.getOffenders.queryOptions());
  const offenders = offendersQuery.data;
  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);
  const [offenderInput, setOffenderInput] = useState("");

  const form = useForm({
    defaultValues: {
      image: {} as File,
      created: new Date(),
      message: "",
      offenders: [] as { name: string; id: string }[],
    },
    validators: {
      onSubmit: bountyFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // If user provided a File, upload it first to get a public URL
        let imageUrl = "";
        const file = value.image as File;
        if (file && file.name) {
          const arr = new Uint8Array(await file.arrayBuffer());
          let binary = "";
          for (let i = 0; i < arr.byteLength; i++)
            binary += String.fromCharCode(arr[i]);
          const b64 = btoa(binary);
          const uploaded = await uploadImage.mutateAsync({
            name: file.name,
            data: b64,
            type: file.type || "application/octet-stream",
          });
          imageUrl = uploaded.url;
        }

        const payload = { ...value, image: imageUrl };
        createBounty.mutate(payload, {
          onSuccess: () => {
            form.reset();
            setFilename("");
            onNewBounty();
            toast.success("Bounty created successfully!");
            setOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to create bounty. Please try again.");
            console.error("Error creating bounty:", error);
          },
        });
      } catch (err) {
        toast.error("Failed to upload image or create bounty.");
        console.error("Create bounty error:", err);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
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
        <form>
          <FieldGroup>
            <form.Field
              name="offenders"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const currentVal = field.state.value.map((o) => o.name);
                const allOffenders = offenders?.map((o) => o.name);
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Offenders:</FieldLabel>
                    <Combobox
                      id={field.name}
                      name={field.name}
                      items={allOffenders}
                      multiple
                      value={currentVal}
                      onValueChange={(val) => {
                        console.log(val);
                        const selectedOffenders = offenders?.filter((o) =>
                          val.includes(o.name),
                        );
                        field.handleChange(selectedOffenders || []);
                      }}
                      onInputValueChange={setOffenderInput}
                      inputValue={offenderInput}
                      aria-invalid={isInvalid}
                    >
                      <ComboboxChips>
                        <ComboboxValue>
                          {currentVal.map((name) => (
                            <ComboboxChip key={`chip-${name}`}>
                              {name}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput placeholder="Add Offender" />
                      </ComboboxChips>
                      <ComboboxContent className="bg-kprimarylight text-themetext-800">
                        <ComboboxEmpty>
                          <Button
                            onClick={async () => {
                              if (offenderInput.trim() === "") return;
                              const newOffender =
                                await createOffender.mutateAsync({
                                  name: offenderInput.trim(),
                                });

                              await offendersQuery.refetch();

                              field.handleChange([
                                ...field.state.value,
                                newOffender,
                              ]);
                              setOffenderInput("");
                            }}
                          >
                            <Plus className="stroke-3" /> Add "{offenderInput}"
                          </Button>
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(name) => (
                            <ComboboxItem key={`opt-${name}`} value={name}>
                              {name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="created"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date:</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={(() => {
                        try {
                          return field.state.value.toISOString().split("T")[0];
                        } catch {
                          return "";
                        }
                      })()}
                      onBlur={field.handleBlur}
                      type="date"
                      onChange={(e) =>
                        field.handleChange(new Date(e.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="message"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Message:</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        maxLength={255}
                        placeholder="Get Chikorita'd!"
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.state.value.length}/255 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Proof!</FieldLabel>
                    <InputGroup className="border-0">
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        type="file"
                        onChange={(e) => {
                          const res = e.target.files?.[0];
                          if (res) {
                            field.handleChange(res);
                            setFilename(res.name);
                          }
                        }}
                        className="hidden"
                        aria-invalid={isInvalid}
                      />
                      <Label
                        htmlFor={field.name}
                        className="rounded border w-full px-1 py-1 col-span-2 flex gap-1 hover:bg-white/10 focus:bg-white/20 cursor-pointer"
                      >
                        <Image />
                        {filename || "Upload Image"}
                      </Label>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              className="bg-ksecondarydark text-ksecondarylight"
              onClick={() => form.reset()}
              disabled={form.state.isPristine}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="bug-report-form"
              className="bg-ksecondarylight text-kprimarylight"
              onClick={() => form.handleSubmit()}
              disabled={
                !form.state.errors ||
                form.state.isSubmitting ||
                form.getFieldValue("image").name === "" ||
                form.getFieldValue("message") === "" ||
                !form.getFieldValue("created")
              }
            >
              Submit
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
