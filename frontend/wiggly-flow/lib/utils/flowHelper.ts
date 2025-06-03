import { customAlphabet, nanoid } from "nanoid";

export const numericId = customAlphabet("1234567890", 13);

export const charId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 12);

export const newId = nanoid; 