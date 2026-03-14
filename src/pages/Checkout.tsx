import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Banknote, Smartphone, Store } from "lucide-react";

const paymentOptions = [
  { value: "cash", label: "Cash On Pickup", icon: Banknote },
  { value: "upi", label: "UPI Screenshot", icon: Smartphone },
  { value: "counter", label: "Pay At Counter", icon: Store },
];

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Get pickup timer from settings
      const { data: settings } = await supabase
        .from("settings")
        .select("pickup_timer_minutes")
        .limit(1)
        .single();

      const pickupTime = settings?.pickup_timer_minutes || 20;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          phone: phone.trim(),
          total,
          status: "pending",
          payment_type: paymentType,
          pickup_time: pickupTime,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_id: item.id,
        quantity: item.quantity,
        price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/order-success?orderId=${order.id}&timer=${pickupTime}`);
    } catch (err: any) {
      toast.error("Failed to place order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-lg">
        <h1 className="font-display text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Customer Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Mobile Number</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" className="bg-secondary border-border" />
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <Label className="text-foreground">Payment Method</Label>
            <div className="grid gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentType(opt.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    paymentType === opt.value
                      ? "border-primary bg-primary/10 gold-glow"
                      : "border-border bg-secondary hover:border-primary/30"
                  }`}
                >
                  <opt.icon className={`h-5 w-5 ${paymentType === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-medium ${paymentType === opt.value ? "text-primary" : "text-foreground"}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-display font-semibold mb-3">Order Summary</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>

          <Button onClick={handleOrder} disabled={loading} className="w-full gold-gradient text-primary-foreground font-semibold gold-glow">
            {loading ? "Placing Order..." : "Confirm Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
