import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, DollarSign, Utensils, Clock } from "lucide-react";
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

const statCards = [
  { key: "orders", label: "Total Orders", icon: Package },
  { key: "sales", label: "Total Sales", icon: DollarSign },
  { key: "menu", label: "Active Menu Items", icon: Utensils },
  { key: "timer", label: "Pickup Timer", icon: Clock },
];

const statusColors: Record<string, string> = {
  pending: "bg-primary/10 text-primary",
  preparing: "bg-yellow-900/30 text-yellow-400",
  ready: "bg-blue-900/30 text-blue-400",
  completed: "bg-green-900/30 text-green-400",
  cancelled: "bg-red-900/30 text-red-400",
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState({ orders: 0, sales: 0, menu: 0, timer: 20 });

  useEffect(() => {
    const fetchData = async () => {
      const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20);
      const { count: menuCount } = await supabase.from("menu_items").select("*", { count: "exact", head: true }).eq("status", "active");
      const { data: settings } = await supabase.from("settings").select("pickup_timer_minutes").limit(1).single();

      if (ordersData) {
        setOrders(ordersData as OrderRow[]);
        setStats({
          orders: ordersData.length,
          sales: ordersData.reduce((s, o) => s + Number(o.total), 0),
          menu: menuCount || 0,
          timer: settings?.pickup_timer_minutes || 20,
        });
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const statValues: Record<string, string | number> = {
    orders: stats.orders,
    sales: `₹${stats.sales}`,
    menu: stats.menu,
    timer: `${stats.timer} min`,
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.key} className="glass-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-muted-foreground text-xs sm:text-sm">{s.label}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{statValues[s.key]}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment</th>
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
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] || statusColors.pending}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
