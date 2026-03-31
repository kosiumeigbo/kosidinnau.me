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
  title: string;
  author: string;
  image: string;
  description: string;
  isbn13: string;
  isbn10: string;
  price: number;
  priceUnit: string;
  publisher: string;
  categories?: string[];
  createdAt: Date;
  updatedAt: Date;
  rank?: number;
  ageGroup?: string;
};

export type GoodResponse<T = NonNullable<unknown>> = {
  success: true;
  data: T;
};

export type BadResponse = { success: false; errors: string[]; status: number };

export type ServerResult<P> = BadResponse | GoodResponse<P>;
