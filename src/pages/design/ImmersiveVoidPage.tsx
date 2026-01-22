import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ color, count = 1000, mouse }: { color: string, count?: number, mouse: React.MutableRefObject<[number, number]> }) {
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Mouse interaction
            particle.mx += (mouse.current[0] * 100 - particle.mx) * 0.1;
            particle.my += (mouse.current[1] * 100 - particle.my) * 0.1;

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={color} roughness={0} metalness={0.5} emissive={color} emissiveIntensity={2} />
        </instancedMesh>
    );
}

const Scene = ({ onSelect }: { onSelect: (mode: 'school' | 'pro') => void }) => {
    const mouse = useRef<[number, number]>([0, 0]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group position={[-10, 0, 0]} onClick={() => onSelect('school')}>
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Text fontSize={3} position={[0, 2, 0]} color="#60A5FA">
                        STUDENT
                    </Text>
                    <Text fontSize={1} position={[0, -1, 0]} color="#93C5FD">
                        Ace Your Exams
                    </Text>
                    <mesh position={[0, 0, -2]}>
                        <torusKnotGeometry args={[1.5, 0.4, 100, 16]} />
                        <meshStandardMaterial color="#60A5FA" wireframe emissive="#2563EB" emissiveIntensity={0.5} />
                    </mesh>
                </Float>
            </group>

            <group position={[10, 0, 0]} onClick={() => onSelect('pro')}>
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Text fontSize={3} position={[0, 2, 0]} color="#F59E0B">
                        PRO
                    </Text>
                    <Text fontSize={1} position={[0, -1, 0]} color="#FCD34D">
                        Career Shift
                    </Text>
                    <mesh position={[0, 0, -2]}>
                        <icosahedronGeometry args={[2, 0]} />
                        <meshStandardMaterial color="#F59E0B" wireframe emissive="#D97706" emissiveIntensity={0.5} />
                    </mesh>
                </Float>
            </group>

            <ParticleField color="#ffffff" count={200} mouse={mouse} />
        </>
    );
};


export const ImmersiveVoidPage = () => {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 20], fov: 75 }} onPointerMove={() => {
                // Simple mouse creation for effect
            }}>
                <color attach="background" args={['#000000']} />
                <Scene onSelect={(mode) => console.log(mode)} />
            </Canvas>
            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                <p className="text-gray-500 font-mono text-xs">CLICK ELEMENT TO ENTER PORTAL</p>
            </div>
        </div>
    );
};
