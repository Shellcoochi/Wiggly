import * as React from "react";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 图片地址
   */
  src?: string;
  /**
   * 替代文本
   */
  alt?: string;
  /**
   * 图片填充模式
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  /**
   * 图片位置
   */
  objectPosition?: string;
  /**
   * 圆角
   */
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  /**
   * 宽度
   */
  width?: string | number;
  /**
   * 高度
   */
  height?: string | number;
  /**
   * 是否显示加载状态
   */
  showLoading?: boolean;
  /**
   * 加载失败时的占位图
   */
  fallback?: string;
  /**
   * 是否填充父容器
   */
  fill?: boolean;
  /**
   * 图片优先级
   */
  priority?: boolean;
  /**
   * 图片大小
   */
  sizes?: string;
  /**
   * 质量
   */
  quality?: number;
}

// 圆角映射
const ROUNDED_MAP = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

// 填充模式映射
const OBJECT_FIT_MAP = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src = "https://placehold.co/400x300/e2e8f0/64748b?text=Image",
      alt = "图片",
      objectFit = "cover",
      objectPosition = "center",
      rounded = "md",
      width,
      height,
      showLoading = true,
      fallback = "https://placehold.co/400x300/fecaca/dc2626?text=Load+Failed",
      fill = false,
      priority = false,
      sizes = "100vw",
      quality = 75,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const handleLoad = () => {
      setLoading(false);
      setError(false);
    };

    const handleError = () => {
      setLoading(false);
      setError(true);
    };

    // 解析宽度和高度
    const getNumberValue = (
      value: string | number | undefined
    ): number | undefined => {
      if (value === undefined) return undefined;
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const num = parseInt(value, 10);
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    };

    const numericWidth = getNumberValue(width);
    const numericHeight = getNumberValue(height);

    // 计算容器样式
    const containerStyle: React.CSSProperties = {
      ...style,
    };

    if (!fill) {
      if (width) containerStyle.width = width;
      if (height) containerStyle.height = height;
    }

    // 如果 fill 为 true，容器需要有明确的尺寸
    const containerClassName = cn(
      "relative inline-block overflow-hidden",
      fill && "w-full h-full",
      ROUNDED_MAP[rounded],
      className
    );

    return (
      <div className={containerClassName} style={containerStyle}>
        {/* 加载状态 */}
        {loading && showLoading && (
          <div
            className={cn(
              "absolute inset-0 bg-muted animate-pulse flex items-center justify-center z-10",
              ROUNDED_MAP[rounded]
            )}
          >
            <span className="text-xs text-muted-foreground">加载中...</span>
          </div>
        )}

        {/* 图片 */}
        <NextImage
          ref={ref}
          src={error ? fallback : src}
          alt={alt}
          width={numericWidth}
          height={numericHeight}
          fill={fill}
          priority={priority}
          sizes={sizes}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'h-full',
            OBJECT_FIT_MAP[objectFit],
            loading && "opacity-0",
            ROUNDED_MAP[rounded],
            fill && "w-full h-full"
          )}
          style={{
            objectPosition,
          }}
          {...props}
        />
      </div>
    );
  }
);

Image.displayName = "Image";

export { Image };
