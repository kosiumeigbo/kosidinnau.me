import { Container } from "@/lib/components";
import { BadResponse, Book, GoodResponse } from "@/lib/types";
import React from "react";

export default async function Page() {
  const res = await fetch(process.env.API_URL, {
    headers: { "Authorization": `Bearer ${process.env.BEARER_AUTH_TOKEN}`, "Content-Type": "application/json" },
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const errorResponse = (await res.json()) as BadResponse;
    throw new Error(errorResponse.errors[0]);
  }

  const { data, success } = (await res.json()) as GoodResponse<Book | null>;

  return (
    <Container>
      <h1 className="flex flex-col items-center justify-between text-center text-3xl font-normal">
        We&apos;re cooking something...
      </h1>
    </Container>
  );
}
