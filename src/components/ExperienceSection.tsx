import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimelineEntry {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
  sort_order: number | null;
}

const fallbackEntries: TimelineEntry[] = [
  {
    id: "fallback-journey",
    title: "My Journey is Just Beginning",
    company: "Building, learning, and improving every single day",
    start_date: "2024",
    end_date: "Present",
    description: "Second-year CS student focused on frontend craft, full-stack growth, and creating polished digital experiences.",
    sort_order: 0,
  },
  {
    id: "fallback-education",
    title: "Education",
    company: "Computer Science",
    start_date: "2024",
    end_date: "Present",
    description: "Growing through DSA, web development, system design fundamentals, and hands-on product building.",
    sort_order: 1,
  },
];

const ExperienceSection = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from("timeline_entries")
          .select("*")
          .order("sort_order");

        if (error) throw error;
        setEntries(data && data.length > 0 ? data : fallbackEntries);
      } catch (error) {
        console.error("Failed to load experience section", error);
        setEntries(fallbackEntries);
      } finally {
        setLoaded(true);
      }
    };

    fetchEntries();
  }, []);

  if (!loaded) return null;

  return (
    <section id="experience" className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-gradient-purple mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Experience
        </motion.h2>

        <div style={{ position: "relative", paddingLeft: 32 }}>
          {/* Vertical gradient line */}
          <motion.div
            style={{
              position: "absolute",
              left: 16,
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(to bottom, #7c3aed, #c084fc)",
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {entries.map((entry, index) => {
            const isFirst = index === 0;
            const dotColor = isFirst ? "#c084fc" : "#4f46e5";
            const isPresent = entry.end_date === "Present" || !entry.end_date;

            return (
              <motion.div
                key={entry.id}
                style={{ position: "relative", marginBottom: index < entries.length - 1 ? 48 : 0 }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -22,
                    top: 24,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: dotColor,
                    boxShadow: `0 0 10px ${dotColor}`,
                    zIndex: 10,
                  }}
                />
                {/* Pulse ring for first entry */}
                {isFirst && isPresent && (
                  <motion.div
                    style={{
                      position: "absolute",
                      left: -28,
                      top: 18,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: `2px solid ${dotColor}`,
                      zIndex: 9,
                    }}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <div
                  className="glass-card rounded-2xl p-8"
                  style={{ marginLeft: 8, borderColor: `${dotColor}20` }}
                >
                  <span style={{ color: dotColor, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : " – Present"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2 mb-2">
                    {entry.title}
                  </h3>
                  {entry.company && (
                    <p className="text-sm text-muted-foreground mb-2">{entry.company}</p>
                  )}
                  {entry.description && (
                    <p className="text-muted-foreground leading-relaxed">{entry.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
