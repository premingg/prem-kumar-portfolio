import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Layers, Sparkles, Database, FileCode, Zap } from "lucide-react";

const offers = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Responsive, fast, and beautiful UIs built with modern web technologies",
    accent: "#c084fc",
  },
  {
    icon: Layers,
    title: "Full Stack Projects",
    description: "End-to-end web apps from database to pixel-perfect frontend",
    accent: "#c084fc",
  },
  {
    icon: Sparkles,
    title: "UI & Interactions",
    description: "Thoughtful animations and micro-interactions that make products feel alive",
    accent: "#67e8f9",
  },
  {
    icon: Database,
    title: "Database Integration",
    description: "Structured data handling with Supabase and SQL for smooth performance",
    accent: "#67e8f9",
  },
  {
    icon: FileCode,
    title: "Clean Code",
    description: "Readable, modular, maintainable code that scales with your project",
    accent: "#c084fc",
  },
  {
    icon: Zap,
    title: "Problem Solving",
    description: "Breaking down complex problems into elegant, efficient solutions",
    accent: "#67e8f9",
  },
];

// Duplicate for seamless loop
const duplicatedOffers = [...offers, ...offers];

const WhatIOfferSection = () => {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 });
  const heading = "What I Offer".split("");

  return (
    <section id="offer" className="relative z-10 py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading with glitch */}
        <div ref={headingRef} className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold">
            {heading.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-gradient-purple"
                initial={{ opacity: 0, y: 30 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
        </div>
      </div>

      {/* Infinite scroll gallery */}
      <div className="relative group">
        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{ willChange: "transform" }}
          whileHover={{ animationPlayState: "paused" } as any}
        >
          {duplicatedOffers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={i}
                className="glass-card rounded-2xl p-6 w-64 sm:w-72 flex-shrink-0 group/card transition-all duration-300"
                style={{
                  borderColor: `${offer.accent}15`,
                }}
                whileHover={{
                  y: -8,
                  boxShadow: `0 0 30px ${offer.accent}25`,
                  borderColor: `${offer.accent}40`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${offer.accent}12` }}
                >
                  <Icon size={20} style={{ color: offer.accent }} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{offer.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{offer.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pause on hover via CSS */}
        <style>{`
          .group:hover > div {
            animation-play-state: paused !important;
          }
          .group:hover [style*="animation"] {
            animation-play-state: paused !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default WhatIOfferSection;
