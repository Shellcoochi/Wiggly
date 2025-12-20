import { usePathname } from "next/navigation";
import * as React from "react";

export function useActive() {
  const pathname = usePathname();
  return React.useMemo(() => {
    return (url: string) => {
      return pathname.startsWith(url);
    };
  }, [pathname]);
}
