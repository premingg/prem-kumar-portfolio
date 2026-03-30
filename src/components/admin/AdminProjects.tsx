import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean | null;
  sort_order: number | null;
}

const emptyProject = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  live_url: "",
  featured: false,
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) { toast.error("Image upload failed"); return null; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }

    let imageUrl: string | null = null;
    if (imageFile) imageUrl = await uploadImage(imageFile);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      featured: form.featured,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };

    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Project updated");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast.error("Create failed"); return; }
      toast.success("Project created");
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyProject);
    setImageFile(null);
    fetchProjects();
  };

  const handleEdit = (p: Project) => {
    setEditing(p.id);
    setForm({
      title: p.title,
      description: p.description,
      tech_stack: (p.tech_stack || []).join(", "),
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      featured: p.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Project deleted");
    fetchProjects();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary";

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyProject); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl space-y-4" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editing ? "Edit Project" : "New Project"}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + " resize-none"} />
          <input placeholder="Tech Stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className={inputClass} />
          <input placeholder="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className={inputClass} />
          <input placeholder="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className={inputClass} />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
          </div>
          <button onClick={handleSave} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}>
            {editing ? "Update" : "Create"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}
          >
            <div>
              <p className="font-semibold text-foreground">{p.title}</p>
              <p className="text-sm text-muted-foreground">{(p.tech_stack || []).join(" · ")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
