import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { useRef, useState } from "react";

const socials = [
  {
    name: "Instagram",
    handle: "@hloprem_",
    url: "https://www.instagram.com/hloprem_/",
    icon: Instagram,
    glowColor: "#E1306C",
    bg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
  },
  {
    name: "LinkedIn",
    handle: "Prem Kumar",
    url: "https://www.linkedin.com/in/premmkumarrrr/",
    icon: Linkedin,
    glowColor: "#0A66C2",
    bg: "linear-gradient(135deg, #0077B5, #0A66C2)",
  },
  {
    name: "Email",
    handle: "pkyt090@gmail.com",
    url: "mailto:pkyt090@gmail.com",
    icon: Mail,
    glowColor: "#c084fc",
    bg: "linear-gradient(135deg, #7c3aed, #c084fc)",
  },
  {
    name: "GitHub",
    handle: "@premingg",
    url: "https://github.com/premingg",
    icon: Github,
    glowColor: "#86efac",
    bg: "linear-gradient(135deg, #2ea043, #39d353)",
  },
];

const FlyingPosterCard = ({
  social,
  index,
}: {
  social: (typeof socials)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const Icon = social.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 20, rotateY: x * 20 });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  const handleOpenLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!social.url.startsWith("http")) return;
    e.preventDefault();
    window.open(social.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.a
      ref={cardRef}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded-2xl overflow-hidden group block"
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
      }}
      initial={{
        opacity: 0,
        y: 120,
        rotateX: 25,
        rotateZ: index % 2 === 0 ? -8 : 8,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateZ: 0,
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: index * 0.12,
        duration: 0.8,
        type: "spring",
        stiffness: 80,
        damping: 18,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpenLink}
    >
      <motion.div
        className="p-8 flex flex-col items-center gap-4 relative z-10"
        style={{
          background: "hsl(240 25% 8% / 0.9)",
          border: `1px solid ${social.glowColor}22`,
          borderRadius: 16,
          backdropFilter: "blur(12px)",
        }}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{
          boxShadow: `0 20px 60px ${social.glowColor}30, 0 0 40px ${social.glowColor}15`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: social.bg,
            filter: "blur(40px)",
            transform: "scale(0.8)",
            zIndex: -1,
          }}
        />

        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={32} style={{ color: social.glowColor }} />
        </motion.div>
        <span className="text-foreground font-bold text-base">{social.name}</span>
        <span className="text-muted-foreground text-sm">{social.handle}</span>
      </motion.div>
    </motion.a>
  );
};

const ConnectSection = () => {
  const headingWords = "Find Me On".split(" ");

  return (
    <section id="connect" className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-4 flex justify-center gap-4 flex-wrap">
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-purple"
              initial={{
                opacity: 0,
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 200,
                rotate: (Math.random() - 0.5) * 30,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                delay: i * 0.12,
                duration: 0.7,
                type: "spring",
                stiffness: 120,
                damping: 15,
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-muted-foreground text-lg mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Let's connect, collaborate, or just say hi
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {socials.map((social, i) => (
            <FlyingPosterCard key={social.name} social={social} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-20 mb-6 h-[1px] mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c084fc30, transparent)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          © 2026 Prem Kumar — Built with passion & TypeScript
        </motion.p>
      </div>
    </section>
  );
};

export default ConnectSection;
