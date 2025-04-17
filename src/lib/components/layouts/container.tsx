import { ComponentProps, ReactElement } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: ComponentProps<"div">): ReactElement {
  return (
    <div
      className={cn("mx-auto h-full w-full max-w-screen-2xl px-2 xs:px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
