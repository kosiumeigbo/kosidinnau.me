import React from "react";
import { getMetaDataForFileInWritings } from "@/lib/writings";
import style from "./style.module.css";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return redirect("/");

  const post = await getMetaDataForFileInWritings(slug);
  if (!post) return redirect("/");

  const { htmlContent } = post;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className={style.blogEntry}></div>;
}
