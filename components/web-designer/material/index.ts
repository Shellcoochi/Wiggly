import { Button } from "./Button";

// 组件配置
const recommendedGroup = {
  title: "推荐组件",
  type: "RECOMMENDED",
  children: [Button],
};

const basicCategory = {
  title: "基础组件",
  type: "BASIC",
  children: [recommendedGroup],
};

const categories = [basicCategory];

// 提取所有 assets 和 snippets
const extractMaterials = (categories: any[]) => {
  const assets: any = [];
  const snippets: any = [];

  categories.forEach((category) => {
    category.children.forEach((group: any) => {
      group.children.forEach((component: any) => {
        if (component.asset) {
          assets.push(component.asset);
        }
        if (component.snippet?.snippets) {
          snippets.push(...component.snippet.snippets);
        }
      });
    });
  });

  return { assets, snippets, categories };
};
const materials = extractMaterials(categories);

console.log(materials.assets)
export default materials;
