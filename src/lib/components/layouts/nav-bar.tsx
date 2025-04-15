"use client";

import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import youngMe from "~/public/images/young-me.jpeg";

const navLinkArr = [
  { name: "About", path: "/about" },
  { name: "Writings", path: "/writings" },
] as const;

export type NavLinkArr = typeof navLinkArr;

export function NavBar({ className, ...props }: React.ComponentProps<"nav">): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className={cn("relative w-full border-b py-0.5", className)} {...props}>
      <Container>
        <div className="relative flex w-full items-center justify-center gap-5 py-1">
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
          <div className="absolute left-0 top-0 aspect-square h-full rounded-xl">
            <Link href={"/"}>
              <Image src={youngMe} alt="Photo of a young Kosidinna" className="rounded-full"></Image>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
