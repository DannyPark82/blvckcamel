import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredProducts } = useProducts();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background - using a high quality black sofa image from Unsplash */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          {/* dark living room with black leather sofa */}
          <img 
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
          />
        </div>

        <div className="relative z-20 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight leading-none"
          >
            Redefining <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              Darkness
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto"
          >
            Premium furniture designed for the modern sanctuary. 
            Embrace the elegance of the void.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-8"
          >
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-zinc-200 text-lg px-12 py-8 rounded-none uppercase tracking-widest font-bold transition-all hover:px-16">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/shop?category=leather" className="group relative h-[600px] overflow-hidden">
            {/* black leather texture */}
            <img 
              src="https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=1926&auto=format&fit=crop" 
              alt="Leather Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-display uppercase font-bold tracking-[0.2em] mb-4">Leather</h2>
              <span className="text-sm border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                View Collection
              </span>
            </div>
          </Link>
          
          <Link href="/shop?category=fabric" className="group relative h-[600px] overflow-hidden">
            {/* dark fabric texture close up */}
            <img 
              src="https://pixabay.com/get/g4888b272dff20c66e5ff3b5b3e2e6135250a6189286f1e9209043877e0cf04e10b3e5c9f0750a9fc70b05bf2d22dd1c4f5834809b0be3e70c9a36c8ead647555_1280.jpg" 
              alt="Fabric Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale brightness-75"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-display uppercase font-bold tracking-[0.2em] mb-4">Fabric</h2>
              <span className="text-sm border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                View Collection
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Selection</span>
              <h2 className="text-3xl md:text-4xl font-display uppercase font-bold mt-2">Latest Arrivals</h2>
            </div>
            <Link href="/shop" className="group flex items-center text-sm uppercase tracking-widest hover:text-white/70 transition-colors">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!featuredProducts && Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-900 aspect-[3/4] mb-4" />
                <div className="h-6 bg-zinc-900 w-2/3 mb-2" />
                <div className="h-4 bg-zinc-900 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy/About Banner */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-display uppercase font-bold leading-tight">
              Designed for <br />
              the bold.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              We believe in the power of absence. By removing color, we emphasize texture, 
              form, and quality. Each piece is a statement of minimalist luxury, 
              crafted to transform your space into a sanctuary of calm.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none uppercase tracking-widest py-6 px-8">
              Read Our Story
            </Button>
          </div>
          <div className="relative h-[600px] bg-zinc-900 overflow-hidden">
             {/* minimalist black interior */}
             <img 
               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2727&auto=format&fit=crop"
               alt="Philosophy"
               className="w-full h-full object-cover filter grayscale contrast-125"
             />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
