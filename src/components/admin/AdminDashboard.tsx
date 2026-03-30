import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, MessageSquare, Eye, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  totalProjects: number;
  totalMessages: number;
  totalViews: number;
  uniqueVisitors: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalMessages: 0, totalViews: 0, uniqueVisitors: 0 });
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [projectsRes, messagesRes, viewsRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("visitor_id, created_at"),
      ]);

      const views = viewsRes.data || [];
      const uniqueIds = new Set(views.map((v) => v.visitor_id));

      // Group by date for chart
      const grouped: Record<string, number> = {};
      views.forEach((v) => {
        const d = v.created_at.split("T")[0];
        grouped[d] = (grouped[d] || 0) + 1;
      });
      const chart = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, views]) => ({ date: date.slice(5), views }));

      setStats({
        totalProjects: projectsRes.count || 0,
        totalMessages: messagesRes.count || 0,
        totalViews: views.length,
        uniqueVisitors: uniqueIds.size,
      });
      setChartData(chart);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Projects", value: stats.totalProjects, icon: FolderKanban, color: "#c084fc" },
    { label: "Total Messages", value: stats.totalMessages, icon: MessageSquare, color: "#86efac" },
    { label: "Page Views", value: stats.totalViews, icon: Eye, color: "#60a5fa" },
    { label: "Unique Visitors", value: stats.uniqueVisitors, icon: Users, color: "#f9a8d4" },
  ];

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-6 rounded-2xl"
              style={{
                background: "hsl(0 0% 7%)",
                border: "1px solid hsl(0 0% 100% / 0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div
        className="p-6 rounded-2xl"
        style={{
          background: "hsl(0 0% 7%)",
          border: "1px solid hsl(0 0% 100% / 0.06)",
        }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Traffic (Last 14 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
              labelStyle={{ color: "#999" }}
            />
            <Line type="monotone" dataKey="views" stroke="#c084fc" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
