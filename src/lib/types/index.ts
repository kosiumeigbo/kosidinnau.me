export const allFrontMatterKeys = ["title", "description", "dateOriginallyPublished", "dateModified", "tags"] as const;
export const dateOriginallyPublished = allFrontMatterKeys[2];
export const dateModified = allFrontMatterKeys[3];

export type FrontMatterObjectType = {
  title: string;
  description: string;
  dateOriginallyPublished: Date;
  dateModified: Date;
  tags: string[];
};

export type FrontMatterObjectKeysType = (typeof allFrontMatterKeys)[number];
