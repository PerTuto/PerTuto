
import { clsx } from "clsx";

interface MarqueeProps {
    items: string[];
    className?: string;
}

export const Marquee = ({ items, className }: MarqueeProps) => {
    return (
        <div className={clsx("w-full overflow-hidden bg-[#7C3AED]/10 border-y border-[#7C3AED]/20 py-6 relative z-20 flex select-none", className)}>
            <div className="flex gap-24 min-w-full shrink-0 animate-marquee">
                {/* We duplicate the list to ensure seamless looping. 
             In a robust prod app, we'd calculate width, but CSS animation works for simple text. 
             If using framer-motion for the loop: */}

                <Content items={items} />
            </div>
            <div className="flex gap-24 min-w-full shrink-0 animate-marquee" aria-hidden="true">
                <Content items={items} />
            </div>
        </div>
    );
};

const Content = ({ items }: { items: string[] }) => (
    <>
        {items.map((item, i) => (
            <span key={i} className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/50 shrink-0">
                {item}
            </span>
        ))}
    </>
);
