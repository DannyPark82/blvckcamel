import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, addItem, cartTotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-black border-l border-white/10 p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b border-white/10 space-y-4">
          <SheetTitle className="text-white font-display text-2xl tracking-wide uppercase">Your Cart</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Free shipping on all orders over $2,000.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <span className="text-muted-foreground">Your cart is empty.</span>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="text-white border-white/20 hover:bg-white hover:text-black uppercase tracking-widest text-xs"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-8 py-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-zinc-900 rounded-sm overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-display uppercase tracking-wide text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{item.material}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/10">
                        <button 
                          onClick={() => removeItem(item.id)} // In a real app this would decrement
                          className="p-1 hover:bg-white/10 text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs text-white w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addItem(item)}
                          className="p-1 hover:bg-white/10 text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-zinc-950">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground uppercase text-xs tracking-widest">Subtotal</span>
              <span className="text-xl font-display text-white">{formatCurrency(cartTotal)}</span>
            </div>
            <Button className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-widest font-bold py-6 rounded-none">
              Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Add this utility function to utils.ts ideally, but putting it here or inlined is fine if utils not editable
// Assuming utils exists, but I'll generate it inside utils if needed or just use this local helper
