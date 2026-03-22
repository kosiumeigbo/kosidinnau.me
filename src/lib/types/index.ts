import { allFrontMatterKeys } from "~/shared/constants";

export type FrontMatterObjectType = {
  title: string;
  description: string;
  dateOriginallyPublished: Date;
  dateModified: Date;
  tags: string[];
};

export type FrontMatterObjectKeysType = (typeof allFrontMatterKeys)[number];
