import React from "react";
import { getBlogPostInformationForSlug } from "../../../utils";
import style from "./style.module.css";
import { redirect } from "next/navigation";

// const style = {}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return redirect("/");

  const post = await getBlogPostInformationForSlug(slug);
  if (!post) return redirect("/");

  const { htmlContent } = post;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className={style.blogEntry}></div>;
}
