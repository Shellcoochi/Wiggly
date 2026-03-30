import { customAlphabet } from "nanoid";
import { DesignerNode } from "../types";
import materials from "../material";

export const generateId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  12
);

export const generateNodeId = () => `node_${generateId()}`;

export const findNode = (
  id: string,
  nodes: DesignerNode[]
): DesignerNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(id, node.children);
      if (found) return found;
    }
  }
};

export const findAsset = (componentName: string) => {
  const { assets } = materials;
  return assets.find((asset: any) => asset.componentName === componentName);
};
