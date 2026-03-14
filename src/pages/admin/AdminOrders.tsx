import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  total: number;
  status: string;
  payment_type: string;
  pickup_time: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-primary/10 text-primary",
  preparing: "bg-yellow-900/30 text-yellow-400",
  ready: "bg-blue-900/30 text-blue-400",
  completed: "bg-green-900/30 text-green-400",
  cancelled: "bg-red-900/30 text-red-400",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data as OrderRow[]);
    };
    fetch();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold mb-8">All Orders</h1>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Pickup</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="p-3">{o.customer_name}</td>
                  <td className="p-3 text-muted-foreground">{o.phone}</td>
                  <td className="p-3 text-primary font-semibold">₹{o.total}</td>
                  <td className="p-3 capitalize text-muted-foreground">{o.payment_type}</td>
                  <td className="p-3 text-muted-foreground">{o.pickup_time} min</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] || statusColors.pending}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground">
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
