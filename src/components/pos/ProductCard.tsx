import { Product } from '@/types/pos';
import { usePOS } from '@/context/POSContext';
import { formatCurrency } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { Plus, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = usePOS();
  const cartItem = cart.find(item => item.id === product.id);
  const isLowStock = product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={cn(
        "card-product p-4 flex flex-col items-center gap-3 btn-touch relative group overflow-hidden",
        isOutOfStock && "opacity-60 cursor-not-allowed grayscale",
        cartItem && "ring-2 ring-primary shadow-glow"
      )}
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Quantity badge */}
      {cartItem && (
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-bounce-in z-10">
          {cartItem.quantity}
        </div>
      )}
      
      {/* Low stock warning */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-warning text-warning-foreground text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm z-10">
          <AlertTriangle className="w-3 h-3" />
          Poco stock
        </div>
      )}
      
      {/* Product emoji - larger and with floating animation on hover */}
      <div className="relative">
        <span className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-float inline-block">
          {product.emoji}
        </span>
        
        {/* Add indicator on hover */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50 shadow-lg">
          <Plus className="w-4 h-4" />
        </div>
      </div>
      
      {/* Short code badge */}
      <span className="text-xs font-mono bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full">
        {product.shortCode}
      </span>
      
      {/* Name */}
      <span className="font-semibold text-sm text-center text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
        {product.name}
      </span>
      
      {/* Price */}
      <span className="text-lg font-bold text-primary">
        {formatCurrency(product.price)}
      </span>
      
      {/* Stock indicator */}
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "w-2 h-2 rounded-full",
          isOutOfStock ? "bg-destructive" : isLowStock ? "bg-warning animate-pulse" : "bg-success"
        )} />
        <span className={cn(
          "text-xs",
          isOutOfStock ? "text-destructive font-bold" : "text-muted-foreground"
        )}>
          {isOutOfStock ? 'Sin stock' : `${product.stock} disponibles`}
        </span>
      </div>
    </button>
  );
}
