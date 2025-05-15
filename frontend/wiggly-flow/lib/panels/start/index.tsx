import { FC, memo } from "react";
import { Accordion, AccordionItem } from "@/ui";
import { AddVariableDialog } from "@/lib/components";

const StartPanel: FC = () => {
  return (
    <>
      <AddVariableDialog></AddVariableDialog>
      <Accordion
        type="multiple"
        bordered={false}
        defaultValue={["item-1", "item-2"]}
      >
        <AccordionItem value="item-1" header="标题一" actions="123">
          内容一
        </AccordionItem>
        <AccordionItem value="item-2" header="标题二">
          内容二
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(StartPanel);
