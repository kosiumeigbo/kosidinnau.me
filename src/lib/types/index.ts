export const propKeysStringValue = ["title", "description"] as const;
export const propKeysNotStringValue = ["date" /* "tags" */] as const;
// export const allPropKeys = [...propKeysStringValue, ...propKeysNotStringValue];

export type PropKeysStringValueType = (typeof propKeysStringValue)[number];
export type PropKeysNotStringValueType = (typeof propKeysNotStringValue)[number];
