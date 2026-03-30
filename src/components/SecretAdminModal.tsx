import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SecretAdminModal = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"keyword" | "login">("keyword");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setOpen(true);
        setStep("keyword");
        setKeyword("");
        setEmail("");
        setPassword("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleKeyword = () => {
    if (keyword === "Premingg") {
      setStep("login");
    } else {
      toast.error("Unauthorized access");
      setOpen(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Authentication failed");
      setLoading(false);
      return;
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("Unauthorized access — not an admin");
      await supabase.auth.signOut();
      setLoading(false);
      setOpen(false);
      return;
    }

    toast.success("Welcome, Admin!");
    setOpen(false);
    navigate("/admin");
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-md p-8 rounded-2xl"
            style={{
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 100% / 0.1)",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {step === "keyword" ? (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">🔐 Access Required</h3>
                <input
                  type="password"
                  placeholder="Enter secret keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleKeyword()}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground mb-4 outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  onClick={handleKeyword}
                  className="w-full py-3 rounded-lg font-semibold text-primary-foreground"
                  style={{ backgroundColor: "hsl(var(--purple-accent))" }}
                >
                  Verify
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Admin Login</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground mb-3 outline-none focus:border-primary"
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground mb-4 outline-none focus:border-primary"
                />
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-primary-foreground disabled:opacity-50"
                  style={{ backgroundColor: "hsl(var(--purple-accent))" }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretAdminModal;
