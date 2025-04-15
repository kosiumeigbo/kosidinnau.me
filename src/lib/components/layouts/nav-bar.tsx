"use client";

import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinkArr = [
  { name: "About", path: "/about" },
  { name: "Writings", path: "/writings" },
] as const;

export type NavLinkArr = typeof navLinkArr;

export function NavBar({ className, ...props }: React.ComponentProps<"nav">): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className={cn("relative w-full border-b", className)} {...props}>
      <Container>
        <div className="flex w-full items-center justify-center gap-5 py-2">
          {navLinkArr.map((routeObj, i) => {
            return (
              <Link
                className={cn("border-b-2 border-transparent px-4 py-0", {
                  "border-red-800": routeObj.path === pathname,
                })}
                key={i}
                href={routeObj.path}
              >
                {routeObj.name}
              </Link>
            );
          })}
        </div>
      </Container>
    </nav>
  );
}
