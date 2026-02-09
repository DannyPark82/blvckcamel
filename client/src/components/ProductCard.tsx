import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
            New Arrival
          </span>
        )}
        
        {/* Main Image */}
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> Add to Cart
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <Link href={`/product/${product.id}`} className="block group-hover:opacity-70 transition-opacity">
          <h3 className="text-white font-display text-lg uppercase tracking-wide leading-none">{product.name}</h3>
          <p className="text-muted-foreground text-xs mt-1 capitalize">{product.category} Series</p>
        </Link>
        <span className="text-white font-medium text-sm">
          {formatCurrency(product.price)}
        </span>
      </div>
    </motion.div>
  );
}
