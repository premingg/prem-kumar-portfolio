import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Upload, ExternalLink, Github } from "lucide-react";
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
  sort_order: "0",
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to load projects", error);
      toast.error("Could not load projects");
    } finally {
      setLoading(false);
    }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Project title is required"); return; }
    setSaving(true);

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        github_url: form.github_url.trim() || null,
        live_url: form.live_url.trim() || null,
        featured: form.featured,
        sort_order: parseInt(form.sort_order) || 0,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing);
        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast.success("Project created");
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyProject);
      setImageFile(null);
      setImagePreview(null);
      await fetchProjects();
    } catch (error) {
      console.error("Failed to save project", error);
      toast.error(error instanceof Error ? error.message : "Project save failed");
    } finally {
      setSaving(false);
    }
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
      sort_order: String(p.sort_order || 0),
    });
    setImagePreview(p.image_url || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Project deleted");
    fetchProjects();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none focus:border-primary transition-colors";

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyProject); setImageFile(null); setImagePreview(null); }}
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
            <button onClick={() => { setShowForm(false); setEditing(null); setImagePreview(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Project Name *</label>
            <input placeholder="e.g. MuzixHub" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea placeholder="What does this project do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + " resize-none"} />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tech Stack (comma separated)</label>
            <input placeholder="React, TypeScript, Tailwind CSS" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Live Site URL</label>
              <input placeholder="https://myproject.com" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">GitHub URL</label>
              <input placeholder="https://github.com/user/repo" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
              <input type="number" placeholder="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={inputClass} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                Mark as Featured
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Preview Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors" style={{ border: "1px solid hsl(0 0% 100% / 0.08)" }}>
                <Upload size={16} /> Choose Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-16 h-10 object-cover rounded-lg border border-border" />
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
            style={{ backgroundColor: "hsl(var(--purple-accent))", color: "#0a0a0f" }}
          >
            {saving ? "Saving..." : editing ? "Update Project" : "Create Project"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="p-5 rounded-2xl text-sm text-muted-foreground" style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}>
            No projects yet. Add one here and it will appear in the portfolio section.
          </div>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 100% / 0.06)" }}
          >
            <div className="flex items-center gap-4">
              {p.image_url && (
                <img src={p.image_url} alt={p.title} className="w-12 h-8 object-cover rounded-lg" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{p.title}</p>
                  {p.featured && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "hsl(var(--purple-accent) / 0.2)", color: "hsl(var(--purple-accent))" }}>Featured</span>}
                </div>
                <p className="text-sm text-muted-foreground">{(p.tech_stack || []).join(" · ")}</p>
                <div className="flex gap-3 mt-1">
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ExternalLink size={10} /> Live</a>}
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Github size={10} /> GitHub</a>}
                </div>
              </div>
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
