import { Container as Com } from "../../../ui/container";

const asset = {
  title: "容器",
  componentName: "Container",
  library: Com,
  configure: {
    component: {
      isContainer: true,
    },
    supports: {
      style: true,
      loop: true,
    },
  },
};

const snippet = {
  snippets: [
    {
      id: "Container",
      title: "容器",
      screenshot: "ri-mouse-line",
      schema: {
        componentName: "Container",
        props: {
          width: "full",
          height: "150px",
          direction: "row",
        },
      },
    },
  ],
};

export const Container = { asset, snippet };
