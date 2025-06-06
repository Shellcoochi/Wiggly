"use client";

import { Avatar as Primitive } from "radix-ui";
import { clsx } from "clsx";
import { ReactNode } from "react";

type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string | ReactNode;
  size?: "small" | "default" | "large" | number;
  shape?: "circle" | "square";
  className?: string;
};

const sizeMap = {
  small: "24px",
  default: "32px",
  large: "40px",
};

export const Avatar = ({
  src,
  alt = "",
  fallback,
  size = "default",
  shape = "circle",
  className,
}: AvatarProps) => {
  const resolvedSize = typeof size === "number" ? `${size}px` : sizeMap[size];
  const radiusClass =
    shape === "circle" ? "rounded-full" : "rounded-[var(--radius)]";

  return (
    <Primitive.Root
      className={clsx(
        "inline-flex select-none items-center justify-center overflow-hidden align-middle bg-bg-secondary text-text-secondary",
        radiusClass,
        className
      )}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        fontSize: `calc(${resolvedSize} * 0.4)`,
      }}
    >
      {src && (
        <Primitive.Image
          className="size-full rounded-[inherit] object-cover"
          src={src}
          alt={alt}
        />
      )}
      <Primitive.Fallback
        className="flex size-full items-center justify-center"
        delayMs={src ? 600 : 0}
      >
        {fallback}
      </Primitive.Fallback>
    </Primitive.Root>
  );
};
