import React from "react";
import { getMetaDataForAllFilesInWritings } from "@/lib/writings";
import { Container } from "@/lib/components";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Writings | Kosidinna Umeigbo" };

export default async function Page() {
  const writingObjectsArray = await getMetaDataForAllFilesInWritings();
  return (
    <div className="w-full py-5 md:py-9">
      <Container>
        <p className="mb-5 text-sm sm:text-base md:mb-8">Links to all of my public pieces are below:</p>
        <ul className="">
          {writingObjectsArray
            .sort((a, b) => {
              if (a.date < b.date) {
                return 1;
              }
              if (a.date > b.date) {
                return -1;
              }
              return 0;
            })
            .map(({ title, slug, description }, i) => (
              <li key={i} className="mb-3 sm:mb-5">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 sm:gap-x-3">
                  <span>-</span>
                  <div>
                    <Link
                      href={`/writings/${slug}`}
                      className="text-sm italic no-underline hover:text-slate-500 sm:text-base md:underline"
                    >
                      {title}
                    </Link>
                  </div>
                  <div></div>
                  <p className="hidden md:block md:text-sm">{description}</p>
                </div>
              </li>
            ))}
        </ul>
      </Container>
    </div>
  );
}
