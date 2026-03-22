// @ts-check

/** @type {readonly ["title", "description", "dateOriginallyPublished", "dateModified", "tags"]} */
export const allFrontMatterKeys = ["title", "description", "dateOriginallyPublished", "dateModified", "tags"];

export const dateOriginallyPublished = allFrontMatterKeys[2];
export const dateModified = allFrontMatterKeys[3];
export const requiredPropKeys = [allFrontMatterKeys[0], allFrontMatterKeys[1], allFrontMatterKeys[4]];
