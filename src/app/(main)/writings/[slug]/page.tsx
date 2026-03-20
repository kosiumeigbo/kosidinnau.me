import React from "react";
import { getMetaDataForSingleFileInWritings, getSlugsForAllWritings } from "@/lib/writings";
import { redirect } from "next/navigation";
import { Container } from "@/lib/components";
import { Metadata } from "next";

export function generateStaticParams() {
  const slugs = getSlugsForAllWritings();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return redirect("/writings");

  const writingMetaData = await getMetaDataForSingleFileInWritings(slug);
  if (!writingMetaData) return redirect("/writings");

  const { title, description } = writingMetaData;

  return { title, description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return redirect("/writings");

  const slugs = getSlugsForAllWritings();
  if (!slugs.includes(slug)) return redirect("/writings");

  const writingMetaData = await getMetaDataForSingleFileInWritings(slug);
  if (!writingMetaData) return redirect("/writings");

  const { htmlContent, title, tags, dateOriginallyPublished, dateModified } = writingMetaData;
  console.log(1);

  const dateOriginallyPublishedDateString = dateOriginallyPublished.toDateString();
  const dateModifiedDateString = dateModified.toDateString();

  return (
    <div className="py-5">
      <Container className="max-w-[45rem] text-sm">
        <h1>{title}</h1>
        <div className="pb-2 text-right text-xs italic sm:text-sm">
          Originally published {dateOriginallyPublishedDateString}
        </div>
        {dateModifiedDateString !== dateOriginallyPublishedDateString ? (
          <div className="pb-2 text-right text-xs italic sm:text-sm">Last published {dateModifiedDateString}</div>
        ) : null}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs sm:text-sm md:text-base" key={i} title={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="w-full pt-5" id="writing-piece"></div>
      </Container>
    </div>
  );
}
