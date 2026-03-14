import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

const CATEGORIES = ["Snacks", "Sandwich", "Burger", "Soup", "Rolls", "Maggi", "Shakes"];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  status: string;
}

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "Snacks" });
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("menu_items").select("*").order("category").order("name");
    if (data) setItems(data as MenuItem[]);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("food-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("food-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error("Name and price required"); return; }

    let imageUrl = form.image;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err: any) {
        toast.error("Image upload failed: " + err.message);
        return;
      }
    }

    const payload = { name: form.name, price: Number(form.price), image: imageUrl, category: form.category };

    if (editing) {
      await supabase.from("menu_items").update(payload).eq("id", editing.id);
      toast.success("Item updated");
    } else {
      await supabase.from("menu_items").insert(payload);
      toast.success("Item added");
    }
    setForm({ name: "", price: "", image: "", category: "Snacks" });
    setEditing(null);
    setShowForm(false);
    setImageFile(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    toast.success("Item deleted");
    fetchItems();
  };

  const toggleStatus = async (item: MenuItem) => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    await supabase.from("menu_items").update({ status: newStatus }).eq("id", item.id);
    toast.success(`${item.name} ${newStatus === "active" ? "enabled" : "disabled"}`);
    fetchItems();
  };

  const startEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({ name: item.name, price: String(item.price), image: item.image || "", category: item.category || "Snacks" });
    setShowForm(true);
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Menu Management</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: "", price: "", image: "", category: "Snacks" }); setImageFile(null); }} className="gold-gradient text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="text-foreground">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" /></div>
            <div><Label className="text-foreground">Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-secondary border-border" /></div>
            <div>
              <Label className="text-foreground">Category</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-foreground">Food Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gold-gradient text-primary-foreground">{editing ? "Update" : "Add"}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }} className="border-border">Cancel</Button>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b border-border/50 hover:bg-secondary/30 ${item.status === "inactive" ? "opacity-50" : ""}`}>
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3 text-muted-foreground">{item.category || "—"}</td>
                  <td className="p-3 text-primary font-semibold">₹{item.price}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(item)} className="text-muted-foreground hover:text-primary">
                      {item.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="text-primary"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No menu items yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
