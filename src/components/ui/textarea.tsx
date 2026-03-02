import * as React from "react";

import { cn } from "@/lib/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input  focus-visible:ring-ring/50 focus:ring-1 aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-input/50 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-1 aria-invalid:ring-1 md:text-sm flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
