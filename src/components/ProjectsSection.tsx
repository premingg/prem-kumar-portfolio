import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean | null;
}

const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "MuzixHub",
    description: "A modern music platform where users can browse, discover, and play music with a responsive immersive UI and real-time backend integration.",
    tech_stack: ["TypeScript", "React", "Framer Motion", "Cloud"],
    github_url: "https://github.com/premingg",
    live_url: "#",
    image_url: null,
    featured: true,
  },
  {
    id: "2",
    title: "Coming Soon..",
    description: "A new high-quality product is currently in progress and will be published here soon.",
    tech_stack: ["TBD"],
    github_url: "https://github.com/premingg",
    live_url: "#",
    image_url: null,
    featured: false,
  },
];

const gradients = [
  "radial-gradient(ellipse at 25% 20%, hsl(270 91% 75% / 0.25), transparent 62%), radial-gradient(ellipse at 80% 90%, hsl(270 91% 75% / 0.18), transparent 55%)",
  "radial-gradient(ellipse at 15% 30%, hsl(239 84% 53% / 0.28), transparent 65%), radial-gradient(ellipse at 85% 75%, hsl(270 91% 75% / 0.14), transparent 55%)",
  "radial-gradient(ellipse at 50% 20%, hsl(185 96% 69% / 0.2), transparent 60%), radial-gradient(ellipse at 70% 80%, hsl(270 91% 75% / 0.15), transparent 55%)",
];

const LaptopMockup = ({ project }: { project: Project }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
      {/* Laptop container */}
      <div className="w-full max-w-[480px]">
        {/* Screen */}
        <div
          className="relative rounded-t-xl overflow-hidden border border-b-0"
          style={{
            borderColor: "hsl(0 0% 30% / 0.6)",
            backgroundColor: "hsl(0 0% 8%)",
            aspectRatio: "16 / 10",
          }}
        >
          {/* Screen bezel top */}
          <div
            className="h-5 flex items-center justify-center"
            style={{ backgroundColor: "hsl(0 0% 12%)", borderBottom: "1px solid hsl(0 0% 20% / 0.4)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(0 0% 25%)" }} />
          </div>
          {/* Screen content */}
          <div className="relative w-full h-[calc(100%-20px)] overflow-hidden">
            {project.image_url ? (
              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(hsl(0 0% 100% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 text-center">
                  <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1">{project.title}</h4>
                  <p className="text-xs text-muted-foreground">{project.featured ? "⭐ Featured Project" : "Preview Coming Soon"}</p>
                </div>
                <div className="relative z-10 flex gap-2 mt-2">
                  {(project.tech_stack || []).slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-md text-[10px] font-medium text-muted-foreground"
                      style={{ backgroundColor: "hsl(0 0% 15%)", border: "1px solid hsl(0 0% 20% / 0.5)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Laptop base / hinge */}
        <div
          className="h-3 rounded-b-md mx-auto"
          style={{
            width: "110%",
            marginLeft: "-5%",
            background: "linear-gradient(180deg, hsl(0 0% 22%) 0%, hsl(0 0% 15%) 100%)",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        />
        {/* Bottom notch */}
        <div
          className="h-1 mx-auto rounded-b-sm"
          style={{
            width: "25%",
            backgroundColor: "hsl(0 0% 18%)",
          }}
        />
      </div>
    </div>
  );
};

const StickyProjectCard = ({ project, index, total }: { project: Project; index: number; total: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.5]);
  const blurAmount = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.7]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const filter = useTransform(blurAmount, (v) => `blur(${v}px)`);

  return (
    <div ref={ref} className="relative" style={{ height: "120vh" }}>
      <motion.article
        className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6"
        style={{ scale, opacity, y, filter, zIndex: total - index }}
      >
        <div
          className="relative w-full max-w-5xl h-[68vh] min-h-[460px] rounded-[24px] border overflow-hidden"
          style={{
            background: "hsl(0 0% 5% / 0.9)",
            borderColor: "hsl(0 0% 100% / 0.07)",
            boxShadow: "0 24px 90px hsl(0 0% 0% / 0.5)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: gradients[index % gradients.length] }} />

          <div className="relative z-10 grid h-full lg:grid-cols-[1fr_1fr]">
            {/* Left: Info */}
            <div className="p-5 sm:p-7 lg:p-8 flex flex-col" style={{ borderRight: "1px solid hsl(0 0% 100% / 0.06)" }}>
              <p className="text-sm font-semibold mb-4 text-muted-foreground">
                {String(index + 1).padStart(2, "0")} - {String(total).padStart(2, "0")}
              </p>
              <h3 className="text-3xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-4 text-foreground">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-xl mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.tech_stack || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground"
                    style={{
                      backgroundColor: "hsl(0 0% 5% / 0.45)",
                      border: "1px solid hsl(0 0% 100% / 0.08)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-3">
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                    style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ExternalLink size={14} /> Live Site
                  </motion.a>
                )}
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 text-foreground"
                    style={{
                      backgroundColor: "hsl(0 0% 5% / 0.45)",
                      border: "1px solid hsl(0 0% 100% / 0.08)",
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Github size={14} /> GitHub
                  </motion.a>
                )}
              </div>
            </div>

            {/* Right: Laptop Mockup */}
            <LaptopMockup project={project} />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setProjects(data && data.length > 0 ? data : fallbackProjects);
        setLoaded(true);
      });
  }, []);

  if (!loaded) return null;
  const filteredProjects = projects.filter(
    (project) => project.title.trim().toLowerCase() !== "wall of fame"
  );
  const comingSoonProjects = filteredProjects.filter((project) =>
    project.title.trim().toLowerCase().startsWith("coming soon")
  );
  const nonComingSoonProjects = filteredProjects.filter(
    (project) => !project.title.trim().toLowerCase().startsWith("coming soon")
  );
  const singleComingSoon =
    comingSoonProjects.length > 0
      ? [comingSoonProjects[0]]
      : [
          {
            id: "coming-soon-runtime",
            title: "Coming Soon..",
            description: "A new project will be added here shortly.",
            tech_stack: ["TBD"],
            github_url: "https://github.com/premingg",
            live_url: "#",
            image_url: null,
            featured: false,
          },
        ];
  const displayProjects = [...nonComingSoonProjects, ...singleComingSoon];

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.h2
          className="text-4xl sm:text-6xl font-black text-gradient-purple"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Projects
        </motion.h2>
      </div>
      {displayProjects.map((project, index) => (
        <StickyProjectCard
          key={project.id}
          project={project}
          index={index}
          total={displayProjects.length}
        />
      ))}
    </section>
  );
};

export default ProjectsSection;
