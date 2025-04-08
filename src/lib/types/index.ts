import * as z from "zod";

export const propKeysStringValue = ["title", "description"] as const;
export const propKeysNonStringValue = ["date", "tags"] as const;
// export const allPropKeys = [...propKeysStringValue, ...propKeysNotStringValue];

export const propKeysStringValueSchema = z.enum(propKeysStringValue);
export const propKeysNonStringValueSchema = z.enum(propKeysNonStringValue);

export type PropKeysStringValueType = (typeof propKeysStringValue)[number];
export type PropKeysNonStringValueType = (typeof propKeysNonStringValue)[number];
