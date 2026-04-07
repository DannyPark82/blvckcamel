import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Link, useSearch } from "wouter";
import { cn } from "@/lib/utils";

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const category = params.get("category");

  const { data: products, isLoading } = useProducts(category || undefined);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 border-b border-white/5 bg-zinc-950">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-display uppercase font-bold tracking-tight">
            {category || "All Products"}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Explore our curated collection of premium {category ? category.toLowerCase() : "furniture"} pieces.
            Meticulously crafted for the modern aesthetic.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[80px] z-30 bg-black/90 backdrop-blur border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex space-x-8 overflow-x-auto">
          <Link
            href="/shop"
            className={cn(
              "uppercase tracking-widest text-xs font-bold transition-colors whitespace-nowrap",
              !category ? "text-white" : "text-muted-foreground hover:text-white"
            )}
          >
            All Items
          </Link>
          <Link
            href="/shop?category=leather"
            className={cn(
              "uppercase tracking-widest text-xs font-bold transition-colors whitespace-nowrap",
              category === "leather" ? "text-white" : "text-muted-foreground hover:text-white"
            )}
          >
            Leather
          </Link>
          <Link
            href="/shop?category=fabric"
            className={cn(
              "uppercase tracking-widest text-xs font-bold transition-colors whitespace-nowrap",
              category === "fabric" ? "text-white" : "text-muted-foreground hover:text-white"
            )}
          >
            Fabric
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-900 aspect-square mb-4" />
                <div className="h-6 bg-zinc-900 w-2/3 mb-2" />
                <div className="h-4 bg-zinc-900 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && products?.length === 0 && (
          <div className="py-32 text-center">
            <h3 className="text-2xl font-display uppercase text-white">No products found</h3>
            <p className="text-muted-foreground mt-2">Try checking back later for new inventory.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
