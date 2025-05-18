import React from "react";
import { getMetaDataForFileInWritings, getSlugsForAllWritings } from "@/lib/writings";
import { redirect } from "next/navigation";
import { Container } from "@/lib/components";

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

  const { htmlContent, title, tags, date } = writingMetaData;

  return (
    <div className="py-5">
      <Container className="max-w-[45rem] text-sm">
        <h1>{title}</h1>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs sm:text-sm md:text-base" key={i}>
              {tag}
            </span>
          ))}
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="w-full" id="writing-piece"></div>
      </Container>
    </div>
  );
}
