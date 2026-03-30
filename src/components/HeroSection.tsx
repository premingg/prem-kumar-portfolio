import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { Github, Linkedin, Mail, Download, ArrowDown } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

const roles = ["Frontend Developer", "CS Student", "Problem Solver"];
const LINKEDIN_URL = "https://www.linkedin.com/in/premmkumarrrr/";

function AvatarModel() {
  const { scene, animations } = useGLTF("/models/model.glb");
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    if (names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.3).play();
    }
  }, [actions, names]);

  return <primitive object={scene} scale={1.3} position={[0, -1.2, 0]} />;
}

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nameChars = "Prem Kumar".split("");
  const taglineWords = "Building the web, one line at a time.".split(" ");

  return (
    <section id="hero" className="relative min-h-screen flex items-center z-10">
      <div className="max-w-7xl mx-auto px-6 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1 flex justify-center relative"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-72 h-80 lg:w-96 lg:h-[28rem]">
              <Canvas
                camera={{ position: [0, 0.2, 3.5], fov: 40 }}
                gl={{ antialias: true, toneMappingExposure: 1.18 }}
                dpr={[1, 1.8]}
                style={{ width: "100%", height: "100%" }}
              >
                <ambientLight intensity={0.75} />
                <hemisphereLight color="#fff4e6" groundColor="#20142f" intensity={0.7} />
                <directionalLight color="#fff2de" position={[1.2, 2.8, 2.6]} intensity={1.35} />
                <pointLight color="#ffffff" position={[-1.6, 1.6, 2.2]} intensity={0.95} />
                <pointLight color="#c084fc" position={[2, 2.2, -1.4]} intensity={0.45} />
                <Suspense fallback={null}>
                  <AvatarModel />
                </Suspense>
              </Canvas>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full blur-2xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, hsl(270 91% 75% / 0.3), transparent)" }}
              />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2 space-y-6">
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              👋 Hey there, I'm
            </motion.p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              {nameChars.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-gradient-purple"
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.9 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-muted-foreground font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              19 · New Delhi, India
            </motion.p>

            <motion.div
              className="h-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  className="block text-xl font-semibold"
                  style={{ color: "hsl(var(--purple-accent))" }}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {taglineWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-lg font-semibold text-sm glow-purple-strong"
                style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
              <motion.a
                href="https://drive.google.com/file/d/11_TioeNa7mp4J7-l2NGt2L-G2CZQQXDS/preview"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border font-semibold text-sm flex items-center gap-2"
                style={{ borderColor: "hsl(var(--purple-accent) / 0.4)", color: "hsl(var(--purple-accent))" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={14} />
                Download Resume
              </motion.a>
            </motion.div>

            <motion.div
              className="flex gap-4 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {[
                { icon: Github, href: "https://github.com/premingg", label: "GitHub" },
                { icon: Linkedin, href: LINKEDIN_URL, label: "LinkedIn" },
                { icon: Mail, href: "mailto:pkyt090@gmail.com", label: "Email" },
              ].map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!href.startsWith("http")) return;
                    e.preventDefault();
                    window.open(href, "_blank", "noopener,noreferrer");
                  }}
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground transition-colors"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.3 + i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="text-muted-foreground" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
