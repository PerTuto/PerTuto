'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, Float } from '@react-three/drei';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';
import { Target, Users, Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Path & Checkpoint Data                                             */
/* ------------------------------------------------------------------ */

const CHECKPOINTS = [
    {
        position: [0, 2, 0] as [number, number, number],
        step: '01',
        title: 'Tell Us What You Need',
        desc: 'Share your subject, curriculum, and goals.',
        icon: Target,
        color: '#10b981',
    },
    {
        position: [3, 0, -2] as [number, number, number],
        step: '02',
        title: 'Meet Your Expert',
        desc: 'Get matched with a vetted specialist.',
        icon: Users,
        color: '#3b82f6',
    },
    {
        position: [-2, -2, -4] as [number, number, number],
        step: '03',
        title: 'Start Learning',
        desc: 'Join your first personalized session.',
        icon: Sparkles,
        color: '#f59e0b',
    },
];

// Generate glowing path points between checkpoints
function generatePathPoints(): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < CHECKPOINTS.length - 1; i++) {
        const start = new THREE.Vector3(...CHECKPOINTS[i].position);
        const end = new THREE.Vector3(...CHECKPOINTS[i + 1].position);
        const mid = start.clone().lerp(end, 0.5);
        mid.y += 1.5; // Arc upward
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        points.push(...curve.getPoints(30));
    }
    return points;
}

/* ------------------------------------------------------------------ */
/*  3D Checkpoint Marker                                               */
/* ------------------------------------------------------------------ */

function CheckpointMarker({
    checkpoint,
    isUnlocked,
}: {
    checkpoint: typeof CHECKPOINTS[0];
    isUnlocked: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const Icon = checkpoint.icon;

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            const targetScale = isUnlocked ? 1 : 0.3;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                delta * 3
            );
        }
    });

    return (
        <group position={checkpoint.position}>
            {/* Glowing sphere marker */}
            <mesh ref={meshRef}>
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                    color={checkpoint.color}
                    emissive={checkpoint.color}
                    emissiveIntensity={isUnlocked ? 0.8 : 0.1}
                    transparent
                    opacity={isUnlocked ? 1 : 0.3}
                />
            </mesh>

            {/* Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.02, 16, 32]} />
                <meshBasicMaterial
                    color={checkpoint.color}
                    transparent
                    opacity={isUnlocked ? 0.6 : 0.1}
                />
            </mesh>

            {/* HTML Overlay */}
            {isUnlocked && (
                <Html
                    center
                    distanceFactor={8}
                    position={[0, -1, 0]}
                    style={{ pointerEvents: 'none' }}
                >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-xl border border-slate-100 text-center min-w-[180px] animate-fade-in-up">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-xs font-mono font-black tracking-widest uppercase" style={{ color: checkpoint.color }}>
                                {checkpoint.step}
                            </span>
                        </div>
                        <h4 className="text-sm font-headline font-black text-slate-900">{checkpoint.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{checkpoint.desc}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

/* ------------------------------------------------------------------ */
/*  Scene with Camera Animation                                        */
/* ------------------------------------------------------------------ */

function JourneyScene({ scrollProgress }: { scrollProgress: number }) {
    const pathPoints = useMemo(() => generatePathPoints(), []);
    const { camera } = useThree();

    useFrame(() => {
        // Interpolate camera position along the path based on scroll
        const pathIndex = Math.floor(scrollProgress * (pathPoints.length - 1));
        const clampedIndex = Math.min(pathIndex, pathPoints.length - 2);
        const nextIndex = Math.min(clampedIndex + 1, pathPoints.length - 1);
        const localT = (scrollProgress * (pathPoints.length - 1)) - clampedIndex;

        const currentPos = pathPoints[clampedIndex];
        const nextPos = pathPoints[nextIndex];

        if (currentPos && nextPos) {
            const targetX = THREE.MathUtils.lerp(currentPos.x, nextPos.x, localT);
            const targetY = THREE.MathUtils.lerp(currentPos.y, nextPos.y, localT) + 3;
            const targetZ = THREE.MathUtils.lerp(currentPos.z, nextPos.z, localT) + 6;

            camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
            camera.lookAt(
                THREE.MathUtils.lerp(currentPos.x, nextPos.x, localT),
                THREE.MathUtils.lerp(currentPos.y, nextPos.y, localT),
                THREE.MathUtils.lerp(currentPos.z, nextPos.z, localT),
            );
        }
    });

    // Path line
    const linePoints = useMemo(() => pathPoints.map((p) => [p.x, p.y, p.z] as [number, number, number]), [pathPoints]);

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />

            {/* Glowing path line */}
            <Line
                points={linePoints}
                color="#1b7a6d"
                lineWidth={2}
                opacity={0.5}
                transparent
            />

            {/* Checkpoints */}
            {CHECKPOINTS.map((cp, i) => (
                <CheckpointMarker
                    key={cp.step}
                    checkpoint={cp}
                    isUnlocked={scrollProgress > (i / CHECKPOINTS.length) + 0.05}
                />
            ))}

            {/* Floating particles for atmosphere */}
            {Array.from({ length: 40 }).map((_, i) => (
                <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2} floatIntensity={0.3}>
                    <mesh position={[
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 15 - 5,
                    ]}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} />
                    </mesh>
                </Float>
            ))}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Fallback                                                           */
/* ------------------------------------------------------------------ */

function JourneyFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Loading Journey…</p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function JourneyMap3D({ className = '' }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (value) => {
        setScrollProgress(value);
    });

    return (
        <section ref={containerRef} className={`relative ${className}`} style={{ backgroundColor: '#0a0f1a' }}>
            {/* Header */}
            <div className="text-center pt-24 pb-8 px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-headline font-black mb-4 tracking-tight text-white">
                    Your Learning <span className="text-emerald-400">Journey</span>
                </h2>
                <p className="text-lg text-slate-400 font-medium max-w-lg mx-auto">
                    Scroll to fly through the path. Watch checkpoints unlock as you progress.
                </p>
            </div>

            {/* 3D Canvas — tall to enable scroll */}
            <div className="w-full h-[80vh] sticky top-0">
                <Suspense fallback={<JourneyFallback />}>
                    <Canvas
                        camera={{ position: [0, 5, 10], fov: 50 }}
                        dpr={[1, 1.5]}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <JourneyScene scrollProgress={scrollProgress} />
                    </Canvas>
                </Suspense>
            </div>

            {/* Scroll spacer to create enough scroll distance */}
            <div className="h-[100vh]" />
        </section>
    );
}
