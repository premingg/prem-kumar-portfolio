import { FC, useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface SmoothCursorProps {
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

const ArrowCursor: FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1L8.5 17L10.5 10.5L17 8.5L1 1Z"
      fill="#c084fc"
      stroke="#c084fc"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HandCursor: FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 6px #c084fc)' }}>
    <path
      d="M9 11.5V6a1.5 1.5 0 013 0v5.5m0 0V6.5a1.5 1.5 0 013 0V11m0 0V8a1.5 1.5 0 013 0v8a6 6 0 01-6 6H9a6 6 0 01-6-6v-1a2 2 0 012-2h.5"
      stroke="#c084fc"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export function SmoothCursor({
  springConfig = {
    stiffness: 150,
    damping: 20,
    mass: 1.2,
  },
}: SmoothCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const cursorRotate = useSpring(0, { stiffness: 65, damping: 22, mass: 1.8 });
  const prevPos = useRef({ x: 0, y: 0 });
  const smoothedAngleRef = useRef(0);
  const isMoving = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        smoothedAngleRef.current = smoothedAngleRef.current + (targetAngle - smoothedAngleRef.current) * 0.08;
        cursorRotate.set(smoothedAngleRef.current);
      }
      prevPos.current = { x: e.clientX, y: e.clientY };

      if (!isMoving.current) {
        isMoving.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const clickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        getComputedStyle(target).cursor === 'pointer';
      setIsHoveringClickable(clickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile, cursorX, cursorY, cursorRotate]);

  if (isMobile) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
        rotate: cursorRotate,
        translateX: "-4px",
        translateY: "-4px",
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        animate={{ opacity: isHoveringClickable ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <ArrowCursor />
      </motion.div>
      <motion.div
        animate={{ opacity: isHoveringClickable ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <HandCursor />
      </motion.div>
    </motion.div>
  );
}
