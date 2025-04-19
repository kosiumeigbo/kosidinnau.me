import React from "react";
import style from "./style.module.css";
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

  const { htmlContent } = writingMetaData;

  return (
    <Container className="max-w-[60rem]">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className={style["writing-piece"]}></div>
    </Container>
  );
}
