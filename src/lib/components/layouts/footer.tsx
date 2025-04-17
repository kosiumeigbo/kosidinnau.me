"use client";

import React, { ReactElement } from "react";
import { Container } from "./container";
import { Github, Twitter, Instagram, Linkedin } from "@/lib/components";
import Link from "next/link";

type FooterLink = { component: ReactElement; href: string; title: string };

const footerLinksArray: FooterLink[] = [
  {
    component: <Github className="h-5 w-5 xs:h-7 xs:w-7" />,
    href: "https://github.com/kosiumeigbo",
    title: "Kosidinna's GitHub Profile",
  },
  {
    component: <Twitter className="h-5 w-5 xs:h-7 xs:w-7" />,
    href: "https://twitter.com/kosidinna__",
    title: "Kosidinna's Twitter (aka X) Profile",
  },
  {
    component: <Instagram className="h-5 w-5 xs:h-7 xs:w-7" />,
    href: "https://www.instagram.com/kosidinna_",
    title: "Kosidinna's Instagram Profile",
  },
  {
    component: <Linkedin className="h-5 w-5 xs:h-7 xs:w-7" />,
    href: "https://www.linkedin.com/in/kosidinnaumeigbo",
    title: "Kosidinna's Linkedin Profile",
  },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t-secondary-100 mt-auto w-full border-t py-3">
      <Container className="flex flex-col items-center justify-start gap-3">
        <div className="flex items-center justify-center gap-4">
          {footerLinksArray.map(({ component, href, title }, i) => (
            <Link href={href} target="_blank" key={i} title={title}>
              {component}
            </Link>
          ))}
        </div>
        <p className="text-center text-xs">Copyright © {new Date().getFullYear()} - All right reserved</p>
      </Container>
    </footer>
  );
}
