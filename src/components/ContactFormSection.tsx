import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactFormSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("messages").insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent! I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    }
    setSending(false);
  };

  return (
    <section id="contact" className="relative z-10 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 items-start">
          {/* Left side — Info */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  backgroundColor: "hsl(var(--purple-accent) / 0.1)",
                  border: "1px solid hsl(var(--purple-accent) / 0.2)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles size={14} style={{ color: "hsl(var(--purple-accent))" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--purple-accent))" }}>
                  Let's Connect
                </span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-4">
                <span className="text-gradient-purple">Got an idea?</span>
                <br />
                <span className="text-foreground">Let's make it</span>
                <br />
                <span className="text-foreground">happen.</span>
              </h2>
            </div>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Whether it's a project collaboration, a freelance gig, or just a friendly hello — I'd love to hear from you.
            </motion.p>

            {/* Decorative elements */}
            <motion.div
              className="hidden lg:flex flex-col gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {[
                { icon: Mail, text: "Quick response time" },
                { icon: MessageSquare, text: "Open to collaborations" },
                { icon: Sparkles, text: "Available for freelance" },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "hsl(var(--purple-accent) / 0.1)" }}
                  >
                    <Icon size={14} style={{ color: "hsl(var(--purple-accent))" }} />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side — Form */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow background */}
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, hsl(var(--purple-accent) / 0.08), transparent 70%)",
              }}
            />

            <div
              className="relative rounded-2xl p-6 sm:p-8"
              style={{
                backgroundColor: "hsl(0 0% 6% / 0.8)",
                border: "1px solid hsl(0 0% 100% / 0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <motion.div
                  className="relative"
                  animate={{ scale: focused === "name" ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User size={16} className="text-muted-foreground" style={focused === "name" ? { color: "hsl(var(--purple-accent))" } : {}} />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-5 py-4 rounded-xl text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "hsl(0 0% 8%)",
                      border: `1px solid ${focused === "name" ? "hsl(var(--purple-accent) / 0.5)" : "hsl(0 0% 100% / 0.06)"}`,
                      boxShadow: focused === "name" ? "0 0 20px hsl(var(--purple-accent) / 0.1)" : "none",
                    }}
                    maxLength={100}
                  />
                </motion.div>

                {/* Email field */}
                <motion.div
                  className="relative"
                  animate={{ scale: focused === "email" ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail size={16} className="text-muted-foreground" style={focused === "email" ? { color: "hsl(var(--purple-accent))" } : {}} />
                  </div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-5 py-4 rounded-xl text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "hsl(0 0% 8%)",
                      border: `1px solid ${focused === "email" ? "hsl(var(--purple-accent) / 0.5)" : "hsl(0 0% 100% / 0.06)"}`,
                      boxShadow: focused === "email" ? "0 0 20px hsl(var(--purple-accent) / 0.1)" : "none",
                    }}
                    maxLength={255}
                  />
                </motion.div>

                {/* Message field */}
                <motion.div
                  className="relative"
                  animate={{ scale: focused === "message" ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute left-4 top-4 pointer-events-none">
                    <MessageSquare size={16} className="text-muted-foreground" style={focused === "message" ? { color: "hsl(var(--purple-accent))" } : {}} />
                  </div>
                  <textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    className="w-full pl-11 pr-5 py-4 rounded-xl text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 resize-none"
                    style={{
                      backgroundColor: "hsl(0 0% 8%)",
                      border: `1px solid ${focused === "message" ? "hsl(var(--purple-accent) / 0.5)" : "hsl(0 0% 100% / 0.06)"}`,
                      boxShadow: focused === "message" ? "0 0 20px hsl(var(--purple-accent) / 0.1)" : "none",
                    }}
                    maxLength={1000}
                  />
                </motion.div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--purple-accent)), hsl(270 91% 60%))",
                    color: "#0a0a0f",
                    boxShadow: "0 4px 24px hsl(var(--purple-accent) / 0.3)",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 6px 32px hsl(var(--purple-accent) / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={16} />
                  {sending ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
