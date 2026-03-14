import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroFood from "@/assets/hero-food.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface" />
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">
              Premium Catering
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium Industrial{" "}
              <span className="gold-text">Catering Services</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Quality Meals for Factories and Corporate Units
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#menu">
                <Button size="lg" className="gold-gradient text-primary-foreground font-semibold gold-glow">
                  View Menu
                </Button>
              </a>
              <a href="#menu">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  Order Food
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-75" />
              <img
                src={heroFood}
                alt="Premium food plate"
                className="relative rounded-3xl w-full max-w-lg shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
