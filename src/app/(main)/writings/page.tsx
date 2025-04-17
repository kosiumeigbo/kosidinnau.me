import React from "react";
import { getMetaDataForAllFilesInWritings } from "@/lib/writings";
import { Container } from "@/lib/components/layouts/container";

export default async function Page() {
  const writingObjectsArray = await getMetaDataForAllFilesInWritings();
  return (
    <div className="w-full">
      <Container>
        {writingObjectsArray.map(({ title, slug, description }, i) => (
          <div key={i}>
            {i + 1} {title}
          </div>
        ))}
      </Container>
    </div>
  );
}
