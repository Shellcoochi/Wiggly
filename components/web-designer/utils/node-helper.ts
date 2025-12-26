import { customAlphabet } from "nanoid";

export const generateNodeId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  12
);
