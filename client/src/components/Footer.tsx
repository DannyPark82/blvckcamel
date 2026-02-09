import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-display font-bold tracking-[0.2em]">
              BLVCKCAMEL
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Redefining luxury living with a minimalist, monochrome aesthetic. 
              Furniture that speaks in silence.
            </p>
          </div>

          <div>
            <h4 className="font-display uppercase tracking-widest mb-6 text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=leather" className="hover:text-white transition-colors">Leather Collection</Link></li>
              <li><Link href="/shop?category=fabric" className="hover:text-white transition-colors">Fabric Collection</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase tracking-widest mb-6 text-sm">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Care Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display uppercase tracking-widest mb-6 text-sm">Newsletter</h4>
            <div className="flex flex-col space-y-4">
              <p className="text-xs text-muted-foreground">Subscribe for exclusive releases.</p>
              <div className="flex border-b border-white/20 pb-2">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="bg-transparent border-none outline-none text-white placeholder:text-zinc-600 w-full text-sm uppercase tracking-wider"
                />
                <button className="text-xs uppercase tracking-widest font-bold hover:text-zinc-300">Join</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 uppercase tracking-wider">
          <p>© 2024 BLVCKCAMEL. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-400">Instagram</a>
            <a href="#" className="hover:text-zinc-400">Twitter</a>
            <a href="#" className="hover:text-zinc-400">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
