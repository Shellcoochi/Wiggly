import { FC, memo } from "react";
import { Accordion, AccordionItem } from "@/ui";

const StartPanel: FC = () => {
  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1" header="标题一">
        内容一
      </AccordionItem>
      <AccordionItem value="item-2" header="标题二">
        内容二
      </AccordionItem>
    </Accordion>
  );
};

export default memo(StartPanel);
