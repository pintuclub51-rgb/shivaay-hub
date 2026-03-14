import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Menu", href: "/#menu" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Shivaay Caterer Services" className="h-10 w-10 rounded-full" />
          <span className="font-display text-lg gold-text hidden sm:block">Shivaay Caterer</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/#menu">
            <Button size="sm" className="gold-gradient text-primary-foreground font-semibold gold-glow hidden sm:flex">
              Order Now
            </Button>
          </Link>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border/30 px-4 pb-4">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-foreground/70 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/#menu" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="gold-gradient text-primary-foreground font-semibold w-full mt-2">Order Now</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
