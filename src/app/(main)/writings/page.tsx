import React from "react";
import { getMetaDataForAllFilesInWritings } from "@/lib/writings";

export default async function Page() {
  const writingObjectsArray = await getMetaDataForAllFilesInWritings();
  return (
    <div>
      {writingObjectsArray.map((obj, i) => (
        <div key={i}>
          {i + 1} {obj.title}
        </div>
      ))}
    </div>
  );
}
