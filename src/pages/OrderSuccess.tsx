import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const timerMinutes = parseInt(searchParams.get("timer") || "20", 10);
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-md text-center">
        <div className="glass-card p-8 space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed successfully.
          </p>

          {orderId && (
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm text-foreground">{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          )}

          {/* Countdown Timer */}
          <div className="bg-secondary rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Order Ready In</span>
            </div>
            {secondsLeft > 0 ? (
              <div className="font-display text-5xl font-bold text-primary tabular-nums">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
            ) : (
              <div className="font-display text-2xl font-bold text-green-400">
                Your order is ready! 🎉
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {secondsLeft > 0
                ? `Estimated pickup time: ${timerMinutes} minutes`
                : "Please pick up your order from the counter"}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link to="/">
              <Button className="w-full gold-gradient text-primary-foreground font-semibold gold-glow">
                Back to Home
              </Button>
            </Link>
            <Link to="/#menu">
              <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                Order More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
