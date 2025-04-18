import React from "react";
import { getMetaDataForAllFilesInWritings } from "@/lib/writings";
import { Container } from "@/lib/components/layouts/container";
import Link from "next/link";

export default async function Page() {
  const writingObjectsArray = await getMetaDataForAllFilesInWritings();
  return (
    <div className="w-full">
      <Container>
        <ol>
          {writingObjectsArray.map(({ title, slug, description }, i) => (
            <li key={i}>
              <div>
                {i + 1} <Link href={`/writings/${slug}`}>{title}</Link>
              </div>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
