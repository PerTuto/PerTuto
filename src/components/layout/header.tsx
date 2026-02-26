"use client";

import { usePathname } from "next/navigation";
import { VoiceAssistant } from "../voice-assistant";

const getTitleFromPathname = (pathname: string) => {
  if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
  const title = pathname.split("/").pop()?.replace("-", " ") ?? "";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export function Header() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-auto min-h-[60px] items-center justify-between border-b border-border bg-background/80 px-4 md:px-8 py-3 w-full backdrop-blur-md shrink-0">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Workspace</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <VoiceAssistant />
      </div>
    </header>
  );
}
