import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Github, ExternalLink } from "lucide-react";

interface GitHubProfile {
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  name: string | null;
  login: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVEL_COLORS: Record<number, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

const GitHubSection = () => {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });

  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [monthLabels, setMonthLabels] = useState<{ label: string; col: number }[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [scanColumn, setScanColumn] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, contribRes] = await Promise.all([
          fetch("https://api.github.com/users/premingg"),
          fetch("https://github-contributions-api.jogruber.de/v4/premingg"),
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());

        if (contribRes.ok) {
          const data = await contribRes.json();
          const allDays: ContributionDay[] = data.contributions || [];

          // Build a full year grid: Jan 1 2026 to Dec 31 2026 (or today if before Dec 31)
          const today = new Date();
          const startDate = new Date(2026, 0, 1); // Jan 1, 2026
          const endDate = new Date(2026, 11, 31); // Dec 31, 2026
          const actualEnd = endDate > today ? today : endDate;

          // Build a map of date -> contribution data
          const contribMap = new Map<string, ContributionDay>();
          allDays.forEach(d => contribMap.set(d.date, d));

          // Generate all days from Jan 1 to actualEnd
          const allDates: ContributionDay[] = [];
          const cursor = new Date(startDate);
          while (cursor <= actualEnd) {
            const dateStr = cursor.toISOString().split("T")[0];
            const existing = contribMap.get(dateStr);
            allDates.push(existing || { date: dateStr, count: 0, level: 0 });
            cursor.setDate(cursor.getDate() + 1);
          }

          // Group into weeks (Sun=0 start)
          const grouped: ContributionDay[][] = [];
          let currentWeek: ContributionDay[] = [];

          // Pad first week if it doesn't start on Sunday
          if (allDates.length > 0) {
            const firstDayOfWeek = new Date(allDates[0].date).getDay();
            for (let i = 0; i < firstDayOfWeek; i++) {
              currentWeek.push({ date: "", count: 0, level: 0 });
            }
          }

          allDates.forEach((day) => {
            const dow = new Date(day.date).getDay();
            if (dow === 0 && currentWeek.length > 0) {
              while (currentWeek.length < 7) currentWeek.push({ date: "", count: 0, level: 0 });
              grouped.push(currentWeek);
              currentWeek = [];
            }
            currentWeek.push(day);
          });
          if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push({ date: "", count: 0, level: 0 });
            grouped.push(currentWeek);
          }

          const finalWeeks = grouped;
          setWeeks(finalWeeks);

          // Month labels
          const labels: { label: string; col: number }[] = [];
          let lastMonth = -1;
          finalWeeks.forEach((week, colIdx) => {
            const firstValid = week.find(d => d.date);
            if (firstValid?.date) {
              const month = new Date(firstValid.date).getMonth();
              if (month !== lastMonth) {
                lastMonth = month;
                labels.push({ label: MONTHS[month], col: colIdx });
              }
            }
          });
          setMonthLabels(labels);

          // Total for 2026
          const totalFor2026 = allDates.reduce((s: number, d: ContributionDay) => s + d.count, 0);
          setTotalContributions(totalFor2026);

          // Streak for 2026
          let s = 0;
          for (let i = allDates.length - 1; i >= 0; i--) {
            if (allDates[i].count > 0) s++;
            else break;
          }
          setStreak(s);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error || weeks.length === 0) return;

    const interval = window.setInterval(() => {
      setScanColumn((prev) => (prev + 1) % weeks.length);
    }, 140);

    return () => window.clearInterval(interval);
  }, [loading, error, weeks.length]);

  const statsData = [
    { label: "Repositories", value: profile ? `${profile.public_repos}` : "8+" },
    { label: "Contributions", value: totalContributions ? `${totalContributions}` : "120+" },
    { label: "Current Streak", value: `${streak} day${streak !== 1 ? "s" : ""}` },
  ];

  const cellSize = 10;
  const cellGap = 3;
  const cellStep = cellSize + cellGap;
  const dayLabelWidth = 28;

  return (
    <section id="github" className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-16"
          style={{ color: "hsl(var(--github-green))" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          GitHub
        </motion.h2>

        {/* Profile Card */}
        <motion.div
          className="glass-card rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ borderColor: "hsl(var(--github-green) / 0.12)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="GitHub avatar"
              className="w-20 h-20 rounded-full border-2"
              style={{ borderColor: "hsl(var(--github-green) / 0.3)" }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2"
              style={{
                backgroundColor: "hsl(var(--github-green) / 0.1)",
                borderColor: "hsl(var(--github-green) / 0.3)",
              }}
            >
              <Github size={36} style={{ color: "hsl(var(--github-green))" }} />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">
              {profile?.name || "@premingg"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {profile?.bio || "Building cool things with code"}
            </p>
            <motion.a
              href="https://github.com/premingg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm mt-3 hover:underline"
              style={{ color: "hsl(var(--github-green))" }}
              whileHover={{ scale: 1.05 }}
            >
              View Profile <ExternalLink size={14} />
            </motion.a>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card rounded-xl p-5 text-center"
              style={{ borderColor: "hsl(var(--github-green) / 0.09)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl font-bold" style={{ color: "hsl(var(--github-green))" }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Contribution Graph */}
        <motion.div
          ref={gridRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 8,
            padding: 16,
            position: "relative",
          }}
        >
          {!loading && !error && weeks.length > 0 && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-4 bottom-4"
              animate={{
                left: dayLabelWidth + scanColumn * cellStep,
                opacity: [0.18, 0.42, 0.18],
              }}
              transition={{
                left: { type: "spring", stiffness: 90, damping: 18 },
                opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                width: cellSize + 10,
                borderRadius: 999,
                background: "linear-gradient(180deg, hsl(var(--github-green) / 0), hsl(var(--github-green) / 0.26), hsl(var(--github-green) / 0))",
                filter: "blur(10px)",
                mixBlendMode: "screen",
              }}
            />
          )}

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#21262d", borderTopColor: "#39d353" }} />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(53, ${cellSize}px)`,
                  gridTemplateRows: `repeat(7, ${cellSize}px)`,
                  gap: cellGap,
                  width: "fit-content",
                  margin: "0 auto 16px",
                }}
              >
                {Array.from({ length: 53 * 7 }).map((_, i) => (
                  <div key={i} style={{ width: cellSize, height: cellSize, backgroundColor: "#161b22", borderRadius: 2 }} />
                ))}
              </div>
              <p style={{ color: "#8b949e", fontSize: 14 }}>Could not load contributions</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }} className="hide-scrollbar">
              <div style={{ width: "fit-content" }}>
                {/* Month labels */}
                <div style={{ display: "flex", marginLeft: dayLabelWidth, marginBottom: 4 }}>
                  {(() => {
                    const els: React.ReactNode[] = [];
                    let lastCol = 0;
                    monthLabels.forEach(({ label, col }, idx) => {
                      const gap = col - lastCol;
                      if (gap > 0) {
                        els.push(<div key={`sp-${idx}`} style={{ width: gap * cellStep }} />);
                      }
                      els.push(
                        <span key={label + col} style={{ fontSize: 10, color: "#8b949e", width: cellStep }}>
                          {label}
                        </span>
                      );
                      lastCol = col + 1;
                    });
                    return els;
                  })()}
                </div>

                {/* Graph with day labels */}
                <div style={{ display: "flex" }}>
                  {/* Day labels */}
                  <div style={{ display: "flex", flexDirection: "column", gap: cellGap, marginRight: 4, width: dayLabelWidth - 4 }}>
                    {DAY_LABELS.map((label, i) => (
                      <div key={i} style={{ height: cellSize, fontSize: 10, color: "#8b949e", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
                      gridTemplateRows: `repeat(7, ${cellSize}px)`,
                      gap: cellGap,
                    }}
                  >
                    {weeks.map((week, colIdx) =>
                      week.map((day, rowIdx) => (
                        <motion.div
                          key={`${colIdx}-${rowIdx}`}
                          style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: day.date ? (LEVEL_COLORS[day.level] || LEVEL_COLORS[0]) : LEVEL_COLORS[0],
                            borderRadius: 2,
                            gridColumn: colIdx + 1,
                            gridRow: rowIdx + 1,
                          }}
                          initial={{ opacity: 0 }}
                          animate={gridInView ? { opacity: 1 } : {}}
                          transition={{
                            delay: colIdx * 0.02,
                            duration: 0.3,
                          }}
                          onMouseEnter={(e) => {
                            if (!day.date) return;
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            const parentRect = (gridRef.current as HTMLElement | null)?.getBoundingClientRect();
                            if (!parentRect) return;
                            const d = new Date(day.date);
                            const text = `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
                            setTooltip({
                              x: rect.left - parentRect.left + rect.width / 2,
                              y: rect.top - parentRect.top - 8,
                              text,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Tooltip */}
              {tooltip && (
                <div
                  style={{
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: "translate(-50%, -100%)",
                    background: "#1c2128",
                    color: "#fff",
                    fontSize: 11,
                    padding: "6px 10px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 50,
                    border: "1px solid #30363d",
                  }}
                >
                  {tooltip.text}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubSection;
