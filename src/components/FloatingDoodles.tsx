import { motion } from "framer-motion";

const doodles = [
  { char: "✦", x: "5%", y: "15%", color: "#c084fc", dur: 8 },
  { char: "✧", x: "92%", y: "25%", color: "#67e8f9", dur: 10 },
  { char: "⋆", x: "8%", y: "45%", color: "#f9a8d4", dur: 7 },
  { char: "</>", x: "90%", y: "55%", color: "#c084fc", dur: 12 },
  { char: "{ }", x: "4%", y: "70%", color: "#67e8f9", dur: 9 },
  { char: "✦", x: "95%", y: "80%", color: "#f9a8d4", dur: 11 },
  { char: "⋆", x: "7%", y: "90%", color: "#c084fc", dur: 8 },
  { char: "✧", x: "88%", y: "10%", color: "#67e8f9", dur: 13 },
  { char: "✦", x: "93%", y: "40%", color: "#f9a8d4", dur: 10 },
  { char: "⋆", x: "3%", y: "35%", color: "#c084fc", dur: 9 },
];

const FloatingDoodles = () => {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {doodles.map((d, i) => (
        <motion.span
          key={i}
          className="absolute text-sm font-mono select-none"
          style={{ left: d.x, top: d.y, color: d.color, opacity: 0.12 }}
          animate={{
            y: [0, -15, 5, -10, 0],
            x: [0, 8, -5, 3, 0],
            rotate: [0, 5, -3, 2, 0],
          }}
          transition={{
            duration: d.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {d.char}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingDoodles;
