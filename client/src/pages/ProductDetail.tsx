import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useRoute, Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Loader2, ArrowRight, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  
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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-zinc-900 overflow-hidden w-full">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                />
              </div>
              {/* Mock thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {[product.image, product.image, product.image, product.image].map((img, i) => (
                  <div key={i} className="aspect-square bg-zinc-900 cursor-pointer hover:ring-1 ring-white transition-all">
                    <img src={img} alt="" className="w-full h-full object-cover opacity-70 hover:opacity-100" />
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
    </div>
  );
}
