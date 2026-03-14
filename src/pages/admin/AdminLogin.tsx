import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import logo from "@/assets/logo.png";

// Simple admin password check (no auth system needed for single admin)
const ADMIN_PASSWORD = "shivaay2026";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin");
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-16 w-16 rounded-full" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Shivaay Caterer Services</p>
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password" className="text-foreground">Admin Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter password"
            className="bg-secondary border-border"
          />
        </div>
        <Button onClick={handleLogin} className="w-full gold-gradient text-primary-foreground font-semibold gold-glow">
          <Lock className="h-4 w-4 mr-2" /> Login
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
