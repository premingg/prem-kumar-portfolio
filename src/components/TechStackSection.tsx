import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { motion, useInView } from "framer-motion";

const techStack = [
  { name: "HTML", color: "#E34F26" },
  { name: "CSS", color: "#1572B6" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "REST APIs", color: "#c084fc" },
  { name: "GitHub", color: "#f0f6fc" },
  { name: "Node.js", color: "#68A063" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = techStack.map((_, index) => ({
  scale: [0.82, 0.9, 0.96, 1.02, 1.08][index % 5],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function buildTexture(label: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(180, 160, 0, 256, 256, 260);
  gradient.addColorStop(0, `${color}ff`);
  gradient.addColorStop(0.58, `${color}ab`);
  gradient.addColorStop(1, `${color}34`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "700 62px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(0,0,0,0.88)";
  ctx.strokeText(label, 256, 256);
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillText(label, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    const dt = Math.min(0.08, delta);
    const translation = api.current.translation();

    const impulse = vec
      .set(translation.x, translation.y, translation.z)
      .normalize()
      .multiply(
        new THREE.Vector3(
          -20 * dt * scale,
          -52 * dt * scale,
          -20 * dt * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(18), r(18) - 24, r(18) - 8]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.16 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

function Pointer({
  vec = new THREE.Vector3(),
  isActive,
}: {
  vec?: THREE.Vector3;
  isActive: boolean;
}) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.1
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1.4]} />
    </RigidBody>
  );
}

const TechStackSection = () => {
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 });
  const heading = "Tech Stack".split("");
  const materials = useMemo(
    () =>
      techStack.map((tech) => {
        const texture = buildTexture(tech.name, tech.color);
        return new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: new THREE.Color(tech.color),
          emissiveMap: texture,
          emissiveIntensity: 0.32,
          metalness: 0.46,
          roughness: 0.88,
          clearcoat: 0.12,
        });
      }),
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setIsActive(rect.top < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="techstack"
      ref={sectionRef}
      className="relative z-10 py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold">
            {heading.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-gradient-purple"
                initial={{ opacity: 0, y: 30 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.04,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.div
          className="w-full rounded-3xl overflow-hidden"
          style={{
            height: "420px",
            background:
              "radial-gradient(ellipse at center, rgba(192,132,252,0.05) 0%, transparent 70%)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Canvas
            camera={{ position: [0, 0, 20], fov: 33, near: 1, far: 100 }}
            dpr={[1, 1]}
            gl={{
              alpha: true,
              antialias: false,
              depth: false,
              stencil: false,
              powerPreference: "high-performance",
            }}
            style={{ background: "transparent" }}
            onCreated={(state) => {
              state.gl.toneMapping = THREE.ACESFilmicToneMapping;
              state.gl.toneMappingExposure = 1.45;
            }}
          >
            <ambientLight intensity={1} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.2}
              color="white"
            />
            <directionalLight position={[0, 5, -4]} intensity={2} />
            <Physics gravity={[0, 0, 0]}>
              <Pointer isActive={isActive} />
              {spheres.map((sphere, index) => (
                <SphereGeo
                  key={`tech-sphere-${index}`}
                  scale={sphere.scale}
                  material={materials[index % materials.length]}
                  isActive={isActive}
                />
              ))}
            </Physics>
            <Environment preset="city" environmentIntensity={0.48} />
          </Canvas>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: `${tech.color}15`,
                border: `1px solid ${tech.color}40`,
                color: tech.color,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
            >
              {tech.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
