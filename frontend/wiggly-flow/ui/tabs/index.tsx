"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { clsx } from "clsx";

interface TabsProps {
  tabs: { value: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={clsx("w-full flex flex-col gap-4", className)}
      defaultValue={defaultValue || tabs[0]?.value}
    >
      <TabsPrimitive.List className="flex border-b border-gray-200 space-x-4">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={clsx(
              "px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent",
              "hover:text-black hover:border-gray-300",
              "data-[state=active]:text-black data-[state=active]:border-black",
              "focus:outline-none"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="mt-2"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
