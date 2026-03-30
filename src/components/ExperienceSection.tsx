import { motion } from "framer-motion";

const ExperienceSection = () => {
  return (
    <section id="experience" className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-gradient-purple mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Experience
        </motion.h2>

        {/* Timeline */}
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

          {/* Timeline node — Present */}
          <motion.div
            style={{ position: "relative", marginBottom: 48 }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Pulsing dot — centered on line */}
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 24,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#c084fc",
                boxShadow: "0 0 10px #c084fc",
                zIndex: 10,
              }}
            />
            <motion.div
              style={{
                position: "absolute",
                left: -28,
                top: 18,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "2px solid #c084fc",
                zIndex: 9,
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
              className="glass-card rounded-2xl p-8"
              style={{ marginLeft: 8, borderColor: "hsl(270 91% 75% / 0.12)" }}
            >
              <span style={{ color: "#c084fc", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Present
              </span>
              <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">
                My Journey is Just Beginning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Currently a second-year CS student actively building projects, seeking my first internship opportunity, and leveling up every day.
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            style={{ position: "relative" }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dot — centered on line */}
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 24,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#4f46e5",
                boxShadow: "0 0 8px #4f46e5",
                zIndex: 10,
              }}
            />

            <div
              className="glass-card rounded-2xl p-8"
              style={{ marginLeft: 8, borderColor: "hsl(239 84% 53% / 0.12)" }}
            >
              <span style={{ color: "#4f46e5", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                2024 – 2028
              </span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-2">
                B.Tech CSE — K.R. Mangalam University
              </h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Data Structures", "OOP", "Web Development"].map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1 rounded-full text-xs font-medium glass-card"
                    style={{ color: "#4f46e5" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
