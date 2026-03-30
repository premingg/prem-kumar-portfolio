import { motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const stats = [
  { label: "Projects", value: 2, suffix: "+" },
  { label: "Internship", value: 1, suffix: "" },
  { label: "Certifications", value: 3, suffix: "" },
  { label: "Year", value: 2, suffix: "nd" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
};

const statementLines = [
  "I don't just write code —",
  "I craft experiences.",
  "",
  "Turning ideas into interfaces",
  "that feel alive.",
];

const bodyLines = [
  "I'm a CS student who fell in love with the web —",
  "not just how it looks, but how it feels.",
  "Every scroll, every click, every transition",
  "is an opportunity to create something memorable.",
  "",
  "Currently leveling up in full-stack development,",
  "DSA, and everything in between.",
];

const AboutSection = () => {
  const headingRef = useRef(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 });
  const heading = "About Me".split("");

  const statementCharIndices = useMemo(() => {
    let cursor = 0;
    return statementLines.map((line) => {
      if (!line) {
        cursor += 4;
        return [] as Array<{ char: string; index: number }>;
      }

      const chars = Array.from(line).map((char) => ({
        char,
        index: cursor++,
      }));
      cursor += 2;
      return chars;
    });
  }, []);

  const bodyCharIndices = useMemo(() => {
    let cursor = 0;
    return bodyLines.map((line) => {
      if (!line) {
        cursor += 4;
        return [] as Array<{ char: string; index: number }>;
      }

      const chars = Array.from(line).map((char) => ({
        char,
        index: cursor++,
      }));
      cursor += 2;
      return chars;
    });
  }, []);

  const statementTotalCharSlots = useMemo(
    () => statementCharIndices.flat().length + 10,
    [statementCharIndices]
  );
  const bodyTotalCharSlots = useMemo(
    () => bodyCharIndices.flat().length + 12,
    [bodyCharIndices]
  );

  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ["start 90%", "end 62%"],
  });
  const { scrollYProgress: bodyProgress } = useScroll({
    target: bodyRef,
    offset: ["start 90%", "end 62%"],
  });

  const [visibleStatementChars, setVisibleStatementChars] = useState(0);
  const [visibleBodyChars, setVisibleBodyChars] = useState(0);

  useMotionValueEvent(statementProgress, "change", (value) => {
    const normalized = Math.max(0, Math.min(1, value));
    const accelerated = Math.min(1, normalized * 2.35);
    setVisibleStatementChars(Math.round(accelerated * statementTotalCharSlots));
  });

  useMotionValueEvent(bodyProgress, "change", (value) => {
    const normalized = Math.max(0, Math.min(1, value));
    const accelerated = Math.min(1, normalized * 2.35);
    setVisibleBodyChars(Math.round(accelerated * bodyTotalCharSlots));
  });

  useEffect(() => {
    setVisibleStatementChars(0);
  }, [statementTotalCharSlots]);

  useEffect(() => {
    setVisibleBodyChars(0);
  }, [bodyTotalCharSlots]);

  return (
    <section id="about" className="relative z-10 py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-8 sm:mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold">
            {heading.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-gradient-purple"
                initial={{ opacity: 0, y: 30 }}
                animate={headingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Large statement text */}
        <div ref={statementRef} className="relative min-h-[60vh]">
          <div className="sticky top-16 min-h-[72vh] flex items-center">
            <div className="w-full">
              {statementLines.map((line, lineIndex) => {
                if (line === "") {
                  return <div key={`spacer-${lineIndex}`} className="h-2 sm:h-3" />;
                }

                return (
                  <p
                    key={`line-${lineIndex}`}
                    className="text-[clamp(2.2rem,6vw,5.8rem)] font-black leading-[1.05] tracking-[-0.03em] max-w-[min(98vw,1600px)]"
                    style={{ color: "hsl(var(--text-heading))" }}
                  >
                    {statementCharIndices[lineIndex].map(({ char, index }) => {
                      const revealed = visibleStatementChars >= index;
                      return (
                        <span
                          key={`${lineIndex}-${index}`}
                          className="inline-block"
                          style={{
                            opacity: revealed ? 1 : 0.08,
                            transform: revealed ? "translateY(0)" : "translateY(0.3em)",
                            filter: revealed ? "blur(0px)" : "blur(4px)",
                            transition: "opacity 90ms linear, transform 120ms ease, filter 120ms ease",
                            willChange: "opacity, transform, filter",
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body text as a separate reveal block */}
        <div ref={bodyRef} className="relative min-h-[55vh] mt-2 sm:mt-3">
          <div className="sticky top-16 min-h-[62vh] flex items-center">
            <div className="w-full">
              {bodyLines.map((line, lineIndex) => {
                if (line === "") {
                  return <div key={`body-spacer-${lineIndex}`} className="h-2 sm:h-3" />;
                }

                return (
                  <p
                    key={`body-line-${lineIndex}`}
                    className="text-[clamp(1.45rem,3vw,2.9rem)] font-semibold leading-[1.4] text-muted-foreground max-w-[min(98vw,1650px)]"
                  >
                    {bodyCharIndices[lineIndex].map(({ char, index }) => {
                      const revealed = visibleBodyChars >= index;
                      return (
                        <span
                          key={`body-${lineIndex}-${index}`}
                          className="inline-block"
                          style={{
                            opacity: revealed ? 1 : 0.08,
                            transform: revealed ? "translateY(0)" : "translateY(0.3em)",
                            filter: revealed ? "blur(0px)" : "blur(4px)",
                            transition: "opacity 90ms linear, transform 120ms ease, filter 120ms ease",
                            willChange: "opacity, transform, filter",
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Philosophy + Approach under the story text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 max-w-5xl mx-auto">
            {/* Philosophy card */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              style={{ borderColor: "hsl(var(--purple-accent) / 0.15)" }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--purple-accent))" }}
                />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--purple-accent))" }}>
                  Philosophy
                </span>
              </div>
              <p className="text-foreground leading-relaxed text-lg font-medium">
                "Clean code is not enough.
                <br />
                Great products live at the intersection
                <br />
                of precision and imagination."
              </p>
            </motion.div>

            {/* Approach card */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              style={{ borderColor: "hsl(var(--cyan-accent) / 0.15)" }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--cyan-accent))" }}
                />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--cyan-accent))" }}>
                  Approach
                </span>
              </div>
              <p className="text-foreground leading-relaxed text-lg font-medium">
                "I build with purpose — every animation
                <br />
                is intentional, every interaction considered,
                <br />
                every project a chance to push boundaries."
              </p>
            </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 sm:mt-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card rounded-xl p-6 text-center glow-purple"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-3xl font-bold text-gradient-purple">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
