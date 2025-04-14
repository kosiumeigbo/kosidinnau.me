"use client";

import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navLinkArr = [
  { name: "Home", path: "/" },
  { name: "Writings", path: "/writings" },
] as const;

export type NavLinkArr = typeof navLinkArr;

export function NavBar({ className, ...props }: React.ComponentProps<"nav">): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className={cn("border-b-secondary-100 relative w-full border-b", className)} {...props}>
      <Container>
        {navLinkArr.map((routeObj, i) => {
          return (
            <div className={cn({ "bg-red-300": routeObj.path === pathname })} key={i}>
              {routeObj.name}
            </div>
          );
        })}
      </Container>
    </nav>
  );
}
