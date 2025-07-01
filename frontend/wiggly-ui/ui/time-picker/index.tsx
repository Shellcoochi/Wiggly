"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Icon, Popover, ScrollArea } from "..";

const pad = (num: number) => String(num).padStart(2, "0");

const timeOptions = {
  hours: Array.from({ length: 24 }, (_, i) => pad(i)),
  minutes: Array.from({ length: 60 }, (_, i) => pad(i)),
};

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
}: {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);

  const commit = (h: string, m: string) => {
    const t = `${h}:${m}`;
    setHour(h);
    setMinute(m);
    onChange?.(t);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      showArrow={false}
      className={
        (className =
          "z-50 mt-2 flex w-auto gap-4 rounded-[var(--radius)] border border-border bg-bg-base p-3 shadow-[var(--shadow)] animate-[var(--animate-contentShow)]")
      }
      trigger={
        <button
          type="button"
          className={clsx(
            "inline-flex h-[32px] min-w-[100px] items-center justify-between rounded-[var(--radius)] border border-border bg-bg-base px-3 text-base text-[var(--color-text-primary)] shadow-sm hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-border",
            className
          )}
        >
          {value || placeholder}
          <Icon
            name="time"
            width={14}
            className="ml-1 text-[var(--color-text-secondary)]"
          />
        </button>
      }
    >
      <>
        {(["hours", "minutes"] as const).map((type) => (
          <ScrollArea key={type} className="h-[160px] w-[60px] overflow-hidden">
            <ul className="space-y-1">
              {timeOptions[type].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={clsx(
                      "w-full rounded px-2 py-1 text-left text-sm hover:bg-[var(--color-primary-light)]",
                      (type === "hours" ? hour : minute) === item &&
                        "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    )}
                    onClick={() => {
                      if (type === "hours") {
                        const h = item;
                        const m = minute ?? "00";
                        commit(h, m);
                      } else {
                        const h = hour ?? "00";
                        const m = item;
                        commit(h, m);
                      }
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ))}
      </>
    </Popover>
  );
}
