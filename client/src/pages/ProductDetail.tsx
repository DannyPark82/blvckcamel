import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useRoute, Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Loader2, ArrowRight, Truck, ShieldCheck, RefreshCcw, ZoomIn, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Fetch related products (same category)
  const { data: relatedProducts } = useProducts(product?.category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-4xl font-display uppercase">Product Not Found</h1>
        <Link href="/shop">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative aspect-square bg-zinc-900 overflow-hidden w-full group cursor-pointer"
                onClick={() => setZoomedImage(product.image)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover Overlay with Zoom Icon */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-12 h-12 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Mock thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {(product.images && product.images.length > 0 ? product.images : []).map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-zinc-900 cursor-pointer hover:ring-1 ring-white transition-all relative group"
                    onClick={() => setZoomedImage(img)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover opacity-70 hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <ZoomIn className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center h-full pt-10 lg:pt-0">
              <div className="border-b border-white/10 pb-8 mb-8">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold block mb-2">
                  {product.category} Collection
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase font-bold tracking-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-light text-zinc-300">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="space-y-8 mb-10">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                  <br /><br />
                  Crafted with premium {product.material.toLowerCase()}, this piece exemplifies the BLVCKCAMEL
                  philosophy of uncompromising quality and stark, beautiful simplicity.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-white/10">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Truck className="w-5 h-5 text-white" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">5 Year Warranty</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <RefreshCcw className="w-5 h-5 text-white" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">30-Day Returns</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-auto">
                <Button
                  onClick={() => addItem(product)}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-14 text-sm font-bold uppercase tracking-[0.2em] rounded-none transition-colors"
                >
                  Add to Cart
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Usually ships within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="container mx-auto px-6 mt-32 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-display uppercase font-bold tracking-wider mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <X className="w-10 h-10" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
