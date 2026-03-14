import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer id="contact" className="py-12 bg-surface border-t border-border/30">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="font-display text-lg gold-text">Shivaay Caterer Services</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Premium industrial catering services for factories and corporate units.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <a href="/#menu" className="block hover:text-primary transition-colors">Menu</a>
            <a href="/#about" className="block hover:text-primary transition-colors">About</a>
            <a href="/#services" className="block hover:text-primary transition-colors">Services</a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary flex-shrink-0" /> 8587006920</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary flex-shrink-0" /> 9997199410</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary flex-shrink-0" /> shivaaycatererservices@gmail.com</div>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Address</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-xs font-semibold mb-0.5">Registered Office</p>
                <p>I-1501 Terra Elegance Bhiwadi, Khairthal-Tijara 301019</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground text-xs font-semibold mb-0.5">Central Kitchen</p>
                <p>Rajasthan Housing Board Colony, Aravali Vihar Bhiwadi, Khairthal-Tijara 301019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
        © 2026 Shivaay Caterer Services. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
