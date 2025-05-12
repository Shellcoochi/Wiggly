import * as React from "react";
import { clsx } from "clsx";

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Card({
  title,
  icon,
  subtitle,
  children,
  className,
}: CardProps) {
  return (
      <div
      className={clsx(
        "rounded-xl border shadow-sm bg-white p-2 w-full max-w-md",
        className
      )}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <h2 className="text-lg text-black font-semibold">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
