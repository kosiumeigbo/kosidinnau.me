import { Container } from "@/lib/components";
import { BadResponse, Book, GoodResponse } from "@/lib/types";
import React from "react";

const formattedBookList = function (books: Book[]): string {
  if (books.length === 0) {
    return "";
  }

  const bookTitlesAndAuthors = books.map((bk) => {
    const title = bk.title ?? "Unknown title";
    const author = bk.author ?? "Unknown author";

    return `"${title}" by ${author}`;
  });

  if (bookTitlesAndAuthors.length === 1) {
    return bookTitlesAndAuthors[0];
  }

  const lastItemInBookTitlesAndAuthors = bookTitlesAndAuthors.pop();
  return bookTitlesAndAuthors.join(", ") + `, and ${lastItemInBookTitlesAndAuthors}`;
};

export default async function Page() {
  const res = await fetch(process.env.API_URL, {
    headers: { "Authorization": `Bearer ${process.env.BEARER_AUTH_TOKEN}`, "Content-Type": "application/json" },
    method: "GET",
  });

  if (!res.ok) {
    const errorResponse = (await res.json()) as BadResponse;
    throw new Error(errorResponse.errors[0]);
  }

  const { data } = (await res.json()) as GoodResponse<Book[]>;

  return (
    <Container>
      <h1 className="flex flex-col items-center justify-between text-center text-3xl font-normal">
        We&apos;re cooking something...
      </h1>
      Currently reading: {formattedBookList(data)}
    </Container>
  );
}
