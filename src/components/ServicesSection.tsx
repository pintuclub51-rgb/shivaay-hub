import { motion } from "framer-motion";
import { Building2, Briefcase, Factory, PartyPopper } from "lucide-react";

const services = [
  { icon: Building2, title: "Industrial Canteen Management", desc: "Complete canteen setup and management for industrial facilities." },
  { icon: Briefcase, title: "Corporate Catering", desc: "Professional catering for corporate meetings and offices." },
  { icon: Factory, title: "Factory Food Supply", desc: "Daily meal supply for factory workers with nutritious menus." },
  { icon: PartyPopper, title: "Event Catering", desc: "Special event catering for corporate functions and celebrations." },
];

const ServicesSection = () => (
  <section id="services" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">What We Offer</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Our Services</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center hover:gold-border transition-all duration-300 group"
          >
            <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 group-hover:animate-glow-pulse transition-all">
              <s.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
