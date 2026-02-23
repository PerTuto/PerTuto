"use client";

import { usePathname } from "next/navigation";
import { VoiceAssistant } from "../voice-assistant";

const getTitleFromPathname = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  const title = pathname.split("/").pop()?.replace("-", " ") ?? "";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export function Header() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-auto min-h-[80px] items-center justify-between border-b border-border-dark bg-background-dark/80 px-4 md:px-8 py-4 w-full backdrop-blur-md shrink-0">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Workspace</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">{title}</span>
        </div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Placeholder for global actions if necessary */}
        <VoiceAssistant />
      </div>
    </header>
  );
}
