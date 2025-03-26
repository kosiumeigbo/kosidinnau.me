import React from "react";
import { getInfoObjArrayForAllFilesInWritings } from "@/utils";

export default async function Page() {
  const writingObjectsArray = await getInfoObjArrayForAllFilesInWritings();
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
