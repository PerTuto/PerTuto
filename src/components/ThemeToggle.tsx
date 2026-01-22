import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useEffect, useState } from "react"
import clsx from "clsx"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const toggleDropdown = () => setIsOpen(!isOpen)

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' && <Sun className="h-5 w-5 text-yellow-400" />}
                {theme === 'dark' && <Moon className="h-5 w-5 text-blue-400" />}
                {theme === 'system' && <Monitor className="h-5 w-5 text-gray-400" />}
                <span className="sr-only">Toggle theme</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 bottom-full mb-2 w-32 rounded-lg bg-[#1a1a1a] border border-white/10 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={() => { setTheme("light"); setIsOpen(false); }}
                            className={clsx(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left",
                                theme === "light" ? "text-yellow-400" : "text-gray-400"
                            )}
                        >
                            <Sun className="h-4 w-4" />
                            <span>Light</span>
                        </button>
                        <button
                            onClick={() => { setTheme("dark"); setIsOpen(false); }}
                            className={clsx(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left",
                                theme === "dark" ? "text-blue-400" : "text-gray-400"
                            )}
                        >
                            <Moon className="h-4 w-4" />
                            <span>Dark</span>
                        </button>
                        <button
                            onClick={() => { setTheme("system"); setIsOpen(false); }}
                            className={clsx(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left",
                                theme === "system" ? "text-white" : "text-gray-400"
                            )}
                        >
                            <Monitor className="h-4 w-4" />
                            <span>System</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
