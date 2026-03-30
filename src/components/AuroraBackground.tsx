import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          top: "10%",
          left: "20%",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          top: "50%",
          right: "10%",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #c084fc 0%, transparent 70%)",
          bottom: "20%",
          left: "50%",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 50, -70, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default AuroraBackground;
