import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const timerOptions = [10, 15, 20, 25, 30, 45, 60];

const AdminSettings = () => {
  const [currentTimer, setCurrentTimer] = useState(20);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("settings").select("*").limit(1).single();
      if (data) {
        setCurrentTimer(data.pickup_timer_minutes);
        setSettingsId(data.id);
      }
    };
    fetch();
  }, []);

  const updateTimer = async (minutes: number) => {
    setLoading(true);
    try {
      if (settingsId) {
        await supabase.from("settings").update({ pickup_timer_minutes: minutes }).eq("id", settingsId);
      } else {
        const { data } = await supabase.from("settings").insert({ pickup_timer_minutes: minutes }).select().single();
        if (data) setSettingsId(data.id);
      }
      setCurrentTimer(minutes);
      toast.success(`Pickup time updated to ${minutes} minutes`);
    } catch {
      toast.error("Failed to update timer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>

      <div className="glass-card p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-display text-xl font-semibold">Pickup Timer</h2>
            <p className="text-sm text-muted-foreground">Set the default preparation time for new orders</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {timerOptions.map((min) => (
            <button
              key={min}
              onClick={() => updateTimer(min)}
              disabled={loading}
              className={`p-4 rounded-xl border text-center transition-all ${
                currentTimer === min
                  ? "border-primary bg-primary/10 gold-glow"
                  : "border-border bg-secondary hover:border-primary/30"
              }`}
            >
              <span className={`text-2xl font-bold block ${currentTimer === min ? "text-primary" : "text-foreground"}`}>
                {min}
              </span>
              <span className="text-xs text-muted-foreground">min</span>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-secondary rounded-xl">
          <p className="text-sm text-muted-foreground">
            Current pickup time: <span className="text-primary font-bold">{currentTimer} minutes</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            All new orders will use this pickup time automatically.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
