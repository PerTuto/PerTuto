'use client';

import React, { useRef, useState, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useGamificationStore } from '@/lib/store/useGamificationStore';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface KeywordData {
    label: string;
    categories: string[];
    color: string;
}

const KEYWORDS: KeywordData[] = [
    { label: 'Calculus', categories: ['K-12', 'University'], color: '#1b7a6d' },
    { label: 'Algebra', categories: ['K-12'], color: '#1b7a6d' },
    { label: 'Physics', categories: ['K-12', 'University'], color: '#4f46e5' },
    { label: 'Chemistry', categories: ['K-12'], color: '#4f46e5' },
    { label: 'Biology', categories: ['K-12'], color: '#10b981' },
    { label: 'Economics', categories: ['K-12', 'University'], color: '#f59e0b' },
    { label: 'IB DP', categories: ['K-12'], color: '#ec4899' },
    { label: 'IGCSE', categories: ['K-12'], color: '#ec4899' },
    { label: 'A-Level', categories: ['K-12'], color: '#ec4899' },
    { label: 'Python', categories: ['AI & Tech'], color: '#3b82f6' },
    { label: 'Machine Learning', categories: ['AI & Tech'], color: '#3b82f6' },
    { label: 'Data Science', categories: ['AI & Tech', 'University'], color: '#3b82f6' },
    { label: 'React', categories: ['AI & Tech'], color: '#06b6d4' },
    { label: 'Deep Learning', categories: ['AI & Tech'], color: '#8b5cf6' },
    { label: 'Statistics', categories: ['University', 'AI & Tech'], color: '#f59e0b' },
    { label: 'MBA', categories: ['University'], color: '#f59e0b' },
    { label: 'Linear Algebra', categories: ['University'], color: '#1b7a6d' },
    { label: 'NLP', categories: ['AI & Tech'], color: '#8b5cf6' },
];

const CATEGORIES = ['All', 'K-12', 'University', 'AI & Tech'];

/* ------------------------------------------------------------------ */
/*  3D Keyword Node                                                    */
/* ------------------------------------------------------------------ */

function KeywordNode({
    keyword,
    index,
    total,
    activeCategory,
}: {
    keyword: KeywordData;
    index: number;
    total: number;
    activeCategory: string;
}) {
    const meshRef = useRef<THREE.Group>(null);
    const isActive = activeCategory === 'All' || keyword.categories.includes(activeCategory);

    // Fibonacci sphere distribution for initial positions
    const targetPosition = useMemo(() => {
        const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;
        const radius = isActive ? 3.5 : 6;
        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi),
        );
    }, [index, total, isActive]);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        // Smooth lerp toward target position
        meshRef.current.position.lerp(targetPosition, delta * 2);
        // Fade opacity
        const children = meshRef.current.children;
        for (const child of children) {
            if ((child as any).material) {
                const mat = (child as any).material;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 1 : 0.15, delta * 3);
            }
        }
    });

    return (
        <group ref={meshRef} position={[targetPosition.x, targetPosition.y, targetPosition.z]}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <Text
                    fontSize={isActive ? 0.35 : 0.2}
                    color={isActive ? keyword.color : '#94a3b8'}
                    anchorX="center"
                    anchorY="middle"
                    material-transparent
                    material-opacity={isActive ? 1 : 0.15}
                >
                    {keyword.label}
                </Text>
            </Float>
        </group>
    );
}

/* ------------------------------------------------------------------ */
/*  Rotating Scene                                                     */
/* ------------------------------------------------------------------ */

function ConstellationScene({ activeCategory }: { activeCategory: string }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            {KEYWORDS.map((kw, i) => (
                <KeywordNode
                    key={kw.label}
                    keyword={kw}
                    index={i}
                    total={KEYWORDS.length}
                    activeCategory={activeCategory}
                />
            ))}
            {/* Central glow sphere */}
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial color="#1b7a6d" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

/* ------------------------------------------------------------------ */
/*  Fallback for Suspense                                              */
/* ------------------------------------------------------------------ */

function WebGLFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Loading 3D Scene…</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function MagnetizedFocusModes({ className = '' }: { className?: string }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [hasInteracted, setHasInteracted] = useState(false);
    const addScore = useGamificationStore((s) => s.addScore);

    const handleCategoryChange = useCallback((cat: string) => {
        setActiveCategory(cat);
        if (!hasInteracted) {
            addScore(20);
            setHasInteracted(true);
        }
    }, [hasInteracted, addScore]);

    return (
        <section className={`py-24 md:py-32 px-6 ${className}`} style={{ backgroundColor: '#0f172a' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-headline font-black mb-4 tracking-tight text-white">
                        Explore Our <span className="text-primary">Universe</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto mb-8">
                        Filter by category to see subjects magnetically rearrange. <span className="text-primary font-bold">+20 combo</span> for trying it.
                    </p>

                    {/* Category Toggles */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`
                                    px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300
                                    ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
                    <Suspense fallback={<WebGLFallback />}>
                        <Canvas
                            camera={{ position: [0, 0, 10], fov: 50 }}
                            dpr={[1, 2]}
                            gl={{ antialias: true, alpha: true }}
                        >
                            <ambientLight intensity={0.6} />
                            <pointLight position={[10, 10, 10]} intensity={0.8} />
                            <ConstellationScene activeCategory={activeCategory} />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
        </section>
    );
}
