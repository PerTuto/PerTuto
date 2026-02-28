"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import NET from "vanta/dist/vanta.net.min";

export const VantaBackground = () => {
    const [vantaEffect, setVantaEffect] = useState<any>(0);
    const vantaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                NET({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0x1B7A6D,     // Brand primary teal
                    backgroundColor: 0xFAFAF8, // Brand warm white background
                    points: 12.0,
                    maxDistance: 22.0,
                    spacing: 18.0,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div 
            ref={vantaRef} 
            className="absolute inset-0 z-0 w-full h-full opacity-60" 
        />
    );
};
