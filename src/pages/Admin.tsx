import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, FolderKanban, MessageSquare, BarChart3, Clock, LogOut, Menu, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminTimeline from "@/components/admin/AdminTimeline";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: Clock },
];

const Admin = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0C0C0C" }}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboard />;
      case "projects": return <AdminProjects />;
      case "messages": return <AdminMessages />;
      case "analytics": return <AdminAnalytics />;
      case "timeline": return <AdminTimeline />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0C0C0C", cursor: "auto" }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "hsl(0 0% 5%)",
          borderRight: "1px solid hsl(0 0% 100% / 0.06)",
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gradient-purple">PK Admin</h2>
        </div>
        <nav className="px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
                style={activeTab === tab.id ? { backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" } : {}}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-card transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6"
          style={{
            background: "hsl(0 0% 5% / 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid hsl(0 0% 100% / 0.06)",
          }}
        >
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-foreground capitalize">{activeTab}</h1>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </header>

        <motion.div
          key={activeTab}
          className="p-6 lg:p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
