import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Marquee from "react-fast-marquee";

function MarqueeStrip() {
  return (
    <div className="pointer-events-none select-none" style={{ opacity: 0.42 }}>
      <Marquee speed={36} autoFill gradient={false}>
        <span
          className="mr-20 text-5xl sm:text-8xl uppercase tracking-[0.2em] font-black"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          A Creative Developer
        </span>
        <span
          className="mr-20 text-5xl sm:text-8xl uppercase tracking-[0.2em] font-black"
          style={{ color: "#c084fc" }}
        >
          A Creative Designer
        </span>
      </Marquee>
    </div>
  );
}

function LoaderGame({ out }: { out: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-1"
      animate={{ opacity: out ? 0 : 1, y: out ? -8 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 27 tiny vertical lines */}
      <div className="flex gap-[2px] items-end h-5">
        {[...Array(27)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 2,
              height: `${6 + Math.sin(i * 0.9) * 5}px`,
              background:
                i % 3 === 0
                  ? "rgba(192,132,252,0.8)"
                  : "rgba(192,132,252,0.3)",
              borderRadius: 1,
              animation: `loader-pulse 1.2s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate`,
            }}
          />
        ))}
      </div>
      {/* ball */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c084fc",
          boxShadow: "0 0 8px 2px rgba(192,132,252,0.7)",
          animation: "loader-ball 0.8s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes loader-pulse {
          from { opacity: 0.3; }
          to   { opacity: 1; }
        }
        @keyframes loader-ball {
          from { transform: translateY(4px); }
          to   { transform: translateY(-4px); }
        }
      `}</style>
    </motion.div>
  );
}

interface LoadingProps {
  onDone: () => void;
}

const LoadingScreen = ({ onDone }: LoadingProps) => {
  const [percent, setPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const doneFiredRef = useRef(false);
  const percentRef = useRef(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  useEffect(() => {
    let warmupDone = false;
    let minTimeDone = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let finishId: ReturnType<typeof setInterval> | null = null;

    const setSafePercent = (next: number) => {
      const clamped = Math.max(0, Math.min(100, next));
      percentRef.current = clamped;
      setPercent(clamped);
    };

    setSafePercent(0);

    intervalId = setInterval(() => {
      if (percentRef.current < 92) {
        const step = percentRef.current < 60 ? 2 : 1;
        setSafePercent(percentRef.current + step);
      }
      if (warmupDone && minTimeDone && percentRef.current >= 92) {
        if (intervalId) clearInterval(intervalId);
        finishId = setInterval(() => {
          if (percentRef.current < 100) {
            setSafePercent(percentRef.current + 1);
          } else {
            if (finishId) clearInterval(finishId);
          }
        }, 14);
      }
    }, 28);

    const warmupTimer = setTimeout(() => {
      warmupDone = true;
    }, 1200);

    const minTimeTimer = setTimeout(() => {
      minTimeDone = true;
    }, 1800);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (finishId) clearInterval(finishId);
      clearTimeout(warmupTimer);
      clearTimeout(minTimeTimer);
    };
  }, []);

  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 500);
    }
  }, [percent, loaded]);

  useEffect(() => {
    if (loaded && !doneFiredRef.current) {
      doneFiredRef.current = true;
      setClicked(true);
      setTimeout(() => {
        onDone();
      }, 900);
    }
  }, [loaded, onDone]);

  const safePercent = Math.max(0, Math.min(100, percent));
  const barScale = safePercent / 100;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        background:
          "radial-gradient(1200px 700px at 50% 20%, rgba(192,132,252,0.14), transparent 70%), linear-gradient(180deg, #08080d 0%, #0d0d14 45%, #13131a 100%)",
      }}
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <a
          href="/#"
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "#c084fc", letterSpacing: "0.2em" }}
          data-cursor="disable"
        >
          PK
        </a>
        <LoaderGame out={clicked} />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div
          ref={wrapRef}
          className="relative w-full h-full flex items-center justify-center px-0"
          onMouseMove={handleMouseMove}
          style={
            {
              "--mouse-x": "50%",
              "--mouse-y": "50%",
            } as React.CSSProperties
          }
        >
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 w-full">
            <MarqueeStrip />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgba(192,132,252,0.12), transparent 70%)",
            }}
          />

          <motion.div
            className="relative overflow-hidden rounded-2xl z-10"
            animate={clicked ? { scale: 0.92, opacity: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ width: "min(460px, 88vw)" }}
          >
            <div
              className="px-8 py-5 rounded-2xl text-center"
              style={{
                border: `1px solid ${loaded ? "rgba(192,132,252,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: loaded
                  ? "linear-gradient(135deg, rgba(192,132,252,0.16), rgba(103,232,249,0.08))"
                  : "rgba(255,255,255,0.03)",
                boxShadow: loaded
                  ? "0 0 40px rgba(192,132,252,0.3), 0 0 100px rgba(103,232,249,0.14)"
                  : "0 12px 35px rgba(0,0,0,0.45)",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.5s, background 0.5s",
              }}
            >
              <AnimatePresence mode="wait">
                {!loaded ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div
                      className="text-base sm:text-lg uppercase tracking-[0.2em] font-bold"
                      style={{ color: "rgba(255,255,255,0.72)" }}
                    >
                      Loading
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: 5,
                        background: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        style={{
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #c084fc, #67e8f9)",
                          borderRadius: 99,
                          boxShadow: "0 0 16px rgba(192,132,252,0.45)",
                          transformOrigin: "left center",
                        }}
                        animate={{ scaleX: barScale }}
                        transition={{ duration: 0.16, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-black"
                    style={{ color: "#ffffff", letterSpacing: "0.08em" }}
                  >
                    Welcome ✦
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className="pb-6 text-center text-xs uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        Prem Kumar · Portfolio
      </div>

      <AnimatePresence>
        {clicked && (
          <motion.div
            className="fixed inset-0 z-[201] pointer-events-none"
            style={{ background: "#0a0a0f" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;
