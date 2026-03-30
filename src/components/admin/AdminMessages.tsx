import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean | null;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: Message) => {
    await supabase.from("messages").update({ is_read: !msg.is_read }).eq("id", msg.id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    toast.success("Message deleted");
    fetchMessages();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Messages ({messages.length})</h2>
      {messages.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="p-5 rounded-2xl"
          style={{
            background: msg.is_read ? "hsl(0 0% 6%)" : "hsl(0 0% 8%)",
            border: `1px solid hsl(0 0% 100% / ${msg.is_read ? "0.04" : "0.1"})`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-foreground">{msg.name}</p>
                {!msg.is_read && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full" style={{ backgroundColor: "hsl(var(--purple-accent) / 0.2)", color: "hsl(var(--purple-accent))" }}>
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{msg.email}</p>
              <p className="text-foreground text-sm leading-relaxed">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-3">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleRead(msg)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground" title={msg.is_read ? "Mark unread" : "Mark read"}>
                {msg.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
              </button>
              <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
