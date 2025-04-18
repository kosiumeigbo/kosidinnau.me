import React from "react";
import { getMetaDataForAllFilesInWritings } from "@/lib/writings";
import { Container } from "@/lib/components/layouts/container";
import Link from "next/link";

export default async function Page() {
  const writingObjectsArray = await getMetaDataForAllFilesInWritings();
  return (
    <div className="w-full">
      <Container>
        <ul className="list-outside list-disc">
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
              <li key={i}>
                <div className="ml-5">
                  <div className="italic underline">
                    <Link href={`/writings/${slug}`}>{title}</Link>
                  </div>
                  <p>{description}</p>
                </div>
              </li>
            ))}
        </ul>
      </Container>
    </div>
  );
}
