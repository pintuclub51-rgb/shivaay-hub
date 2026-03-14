import { motion } from "framer-motion";
import { Shield, Clock, Utensils } from "lucide-react";

const features = [
  { icon: Shield, title: "100% Hygienic", desc: "Prepared in sanitized kitchens" },
  { icon: Clock, title: "On-Time Delivery", desc: "Never miss a meal schedule" },
  { icon: Utensils, title: "Fresh Ingredients", desc: "Quality produce every day" },
];

const AboutSection = () => (
  <section id="about" className="py-20 bg-surface">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">About Us</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">About Shivaay Caterer Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We provide hygienic and affordable industrial catering services for factories and corporate units across Bhiwadi, Tapukara, Neemrana and nearby industrial regions.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-6 text-center hover:gold-border transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
