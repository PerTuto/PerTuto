
/**
 * Dubai Skyline Silhouette Component
 * A purely CSS/SVG-based silhouette of Dubai's iconic skyline.
 * Uses inline SVG for a true silhouette effect with transparent background.
 */
export const SkylineBackground = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-[20vh] z-0 pointer-events-none select-none overflow-hidden">
            <svg
                className="w-full h-full opacity-[0.07] dark:opacity-[0.1] transition-opacity duration-500"
                viewBox="0 0 1200 200"
                preserveAspectRatio="xMidYMax slice"
                fill="currentColor"
            >
                {/* Dubai Skyline Silhouette - Refined with more variety */}
                <g className="text-black dark:text-white">
                    {/* Far left - Palm Jumeirah area with varied heights */}
                    <polygon points="0,200 0,160 8,155 8,200" /> {/* Small antenna */}
                    <rect x="15" y="155" width="18" height="45" rx="1" />
                    <polygon points="40,200 40,140 52,130 64,140 64,200" /> {/* Pointed top */}
                    <rect x="72" y="165" width="12" height="35" />
                    <rect x="90" y="150" width="22" height="50" rx="2" />

                    {/* Marina cluster - more organic shapes */}
                    <polygon points="120,200 120,125 128,115 136,125 136,200" /> {/* Spire */}
                    <rect x="145" y="140" width="16" height="60" />
                    <polygon points="168,200 170,135 180,128 190,135 192,200" />
                    <rect x="200" y="130" width="20" height="70" rx="2" />
                    <polygon points="228,200 230,110 240,100 250,110 252,200" /> {/* Cayan Tower inspired */}

                    {/* JBR/Beach area */}
                    <rect x="265" y="145" width="15" height="55" />
                    <rect x="285" y="135" width="18" height="65" rx="1" />
                    <polygon points="310,200 312,150 322,145 332,150 334,200" />
                    <rect x="345" y="140" width="20" height="60" />

                    {/* Media City/Internet City */}
                    <polygon points="375,200 378,120 390,110 402,120 405,200" />
                    <rect x="415" y="150" width="14" height="50" />
                    <rect x="435" y="130" width="22" height="70" rx="2" />

                    {/* Emirates Towers - Dubai's twin icons */}
                    <polygon points="470,200 475,70 490,55 505,70 510,200" />
                    <polygon points="520,200 524,85 535,75 546,85 550,200" />

                    {/* Downtown buildings leading to Burj Khalifa */}
                    <rect x="565" y="125" width="25" height="75" rx="2" />
                    <polygon points="600,200 603,100 615,90 627,100 630,200" />

                    {/* ★ BURJ KHALIFA - The iconic centerpiece ★ */}
                    <polygon points="650,200 655,170 660,100 668,50 680,8 692,50 700,100 705,170 710,200" />

                    {/* Address Hotel / Dubai Mall area */}
                    <polygon points="730,200 735,90 755,75 775,90 780,200" />
                    <rect x="795" y="130" width="22" height="70" rx="2" />

                    {/* Business Bay */}
                    <polygon points="825,200 828,110 840,100 852,110 855,200" />
                    <rect x="868" y="140" width="18" height="60" />
                    <polygon points="895,200 898,120 910,110 922,120 925,200" />

                    {/* Dubai Frame - The iconic picture frame */}
                    <path d="M 945,200 L945,90 L955,70 L995,70 L1005,90 L1005,200 L990,200 L990,100 L960,100 L960,200 Z" />

                    {/* Deira/Creek area */}
                    <rect x="1020" y="145" width="18" height="55" />
                    <polygon points="1045,200 1048,130 1060,120 1072,130 1075,200" />

                    {/* ★ BURJ AL ARAB - Iconic sail shape ★ */}
                    <path d="M 1095,200 Q 1100,140 1115,100 Q 1135,70 1145,75 Q 1155,80 1155,100 Q 1158,140 1155,200 Z" />

                    {/* Far right - Atlantis/Palm area */}
                    <path d="M 1175,200 L1175,150 Q1185,140 1195,145 L1195,200 Z" />
                </g>
            </svg>
        </div>
    );
};
