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
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {title}
        </h1>
      </div>
      <div className="ml-auto">
        <VoiceAssistant />
      </div>
    </header>
  );
}
