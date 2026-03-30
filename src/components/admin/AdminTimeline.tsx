import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface TimelineEntry {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
  sort_order: number | null;
}

const emptyEntry = { title: "", company: "", start_date: "", end_date: "", description: "" };

const AdminTimeline = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEntry);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    const { data } = await supabase.from("timeline_entries").select("*").order("sort_order");
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      start_date: form.start_date,
      end_date: form.end_date || "Present",
      description: form.description.trim(),
    };

    if (editing) {
      const { error } = await supabase.from("timeline_entries").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Entry updated");
    } else {
      const { error } = await supabase.from("timeline_entries").insert(payload);
      if (error) { toast.error("Create failed"); return; }
      toast.success("Entry created");
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyEntry);
    fetchEntries();
  };

  const handleEdit = (e: TimelineEntry) => {
    setEditing(e.id);
    setForm({ title: e.title, company: e.company, start_date: e.start_date, end_date: e.end_date || "", description: e.description });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("timeline_entries").delete().eq("id", id);
    toast.success("Entry deleted");
    fetchEntries();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary";

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Timeline ({entries.length})</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyEntry); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl space-y-4" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editing ? "Edit Entry" : "New Entry"}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <input placeholder="Title / Role" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          <input placeholder="Company / Institution" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Start Date (e.g. 2024)" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
            <input placeholder="End Date (or leave empty for Present)" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + " resize-none"} />
          <button onClick={handleSave} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}>
            {editing ? "Update" : "Create"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
            <div>
              <p className="font-semibold text-foreground">{e.title}</p>
              <p className="text-sm text-muted-foreground">{e.company} · {e.start_date} – {e.end_date || "Present"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(e)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTimeline;
