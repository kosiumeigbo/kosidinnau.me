import { allFrontMatterKeys } from "~/shared";

export type FrontMatterObjectType = {
  title: string;
  description: string;
  dateOriginallyPublished: Date;
  dateModified: Date;
  tags: string[];
};

export type FrontMatterObjectKeysType = (typeof allFrontMatterKeys)[number];
