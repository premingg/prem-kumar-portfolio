import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const AdminAnalytics = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [dailyData, setDailyData] = useState<{ date: string; views: number; unique: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("page_views").select("visitor_id, created_at");
      const views = data || [];
      const uniqueIds = new Set(views.map((v) => v.visitor_id));
      setTotalViews(views.length);
      setUniqueVisitors(uniqueIds.size);

      const grouped: Record<string, { views: number; visitors: Set<string> }> = {};
      views.forEach((v) => {
        const d = v.created_at.split("T")[0];
        if (!grouped[d]) grouped[d] = { views: 0, visitors: new Set() };
        grouped[d].views++;
        grouped[d].visitors.add(v.visitor_id);
      });

      const chart = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, data]) => ({ date: date.slice(5), views: data.views, unique: data.visitors.size }));

      setDailyData(chart);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
          <Eye size={20} className="text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-foreground">{totalViews}</p>
          <p className="text-sm text-muted-foreground">Total Page Views</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
          <Users size={20} className="text-pink-400 mb-3" />
          <p className="text-3xl font-bold text-foreground">{uniqueVisitors}</p>
          <p className="text-sm text-muted-foreground">Unique Visitors</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Daily Traffic (Last 30 days)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
            <Area type="monotone" dataKey="views" stroke="#c084fc" fill="url(#viewsGrad)" strokeWidth={2} />
            <Line type="monotone" dataKey="unique" stroke="#86efac" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;
