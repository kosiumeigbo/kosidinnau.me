import React from "react";
import { getMetaDataForFileInWritings, getSlugsForAllWritings } from "@/lib/writings";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  const slugs = getSlugsForAllWritings();

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return redirect("/");

  const writingMetaData = await getMetaDataForFileInWritings(slug);
  if (!writingMetaData) return redirect("/");

  const { htmlContent } = writingMetaData;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="writing"></div>
    </>
  );
}
