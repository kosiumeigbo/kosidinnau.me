import { allFrontMatterKeys } from "~/shared";

export type FrontMatterObjectType = {
  title: string;
  description: string;
  dateOriginallyPublished: Date;
  dateModified: Date;
  tags: string[];
};

export type FrontMatterObjectKeysType = (typeof allFrontMatterKeys)[number];

export type Book = {
  title: string | null;
  author: string | null;
  image: string | null;
  description: string | null;
  isbn13: string | null;
  isbn10: string | null;
  publisher: string | null;
  categories: string[];
};

export type GoodResponse<T = NonNullable<unknown>> = {
  success: true;
  data: T;
};

export type BadResponse = { success: false; errors: string[]; status: number };

export type ServerResult<P> = BadResponse | GoodResponse<P>;
