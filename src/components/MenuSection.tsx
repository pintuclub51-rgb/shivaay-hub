import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Fallback images by category
import samosaImg from "@/assets/samosa.jpg";
import vegSandwichImg from "@/assets/veg-sandwich.jpg";
import burgerImg from "@/assets/burger.jpg";
import soupImg from "@/assets/soup.jpg";
import paneerRollImg from "@/assets/paneer-roll.jpg";
import vegMaggiImg from "@/assets/veg-maggi.jpg";
import shakeImg from "@/assets/shake.jpg";
import kachoriImg from "@/assets/kachori.jpg";

const categoryFallbacks: Record<string, string> = {
  Snacks: samosaImg,
  Sandwich: vegSandwichImg,
  Burger: burgerImg,
  Soup: soupImg,
  Rolls: paneerRollImg,
  Maggi: vegMaggiImg,
  Shakes: shakeImg,
};

const CATEGORIES = ["All", "Snacks", "Sandwich", "Burger", "Soup", "Rolls", "Maggi", "Shakes"];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
  status: string;
}

const MenuSection = () => {
  const { addItem } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("status", "active")
        .order("category")
        .order("name");
      if (data) setItems(data as MenuItem[]);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  const getImage = (item: MenuItem) => {
    if (item.image && item.image.length > 5) return item.image;
    return categoryFallbacks[item.category || "Snacks"] || samosaImg;
  };

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: getImage(item) });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section id="menu" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-2">Our Menu</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Delicious Food Awaits</h2>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "gold-gradient text-primary-foreground gold-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading menu...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="glass-card overflow-hidden group hover:gold-border transition-all duration-300"
              >
                <div className="relative h-32 sm:h-48 overflow-hidden">
                  <img
                    src={getImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-display text-sm sm:text-lg font-semibold mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg sm:text-xl">₹{item.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(item)}
                      className="gold-gradient text-primary-foreground gold-glow text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No items in this category</div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
