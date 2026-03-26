// @ts-check

/** @type {readonly ["title", "description", "dateOriginallyPublished", "dateModified", "tags"]} */
const allFrontMatterKeys = ["title", "description", "dateOriginallyPublished", "dateModified", "tags"];

const dateOriginallyPublished = allFrontMatterKeys[2];
const dateModified = allFrontMatterKeys[3];
const requiredPropKeys = [allFrontMatterKeys[0], allFrontMatterKeys[1], allFrontMatterKeys[4]];

module.exports = { allFrontMatterKeys, dateOriginallyPublished, dateModified, requiredPropKeys };
