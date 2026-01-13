import { Plus, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/pos';
import { usePOS } from '@/context/POSContext';
import { formatCurrency } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = usePOS();
  const cartItem = cart.find(item => item.id === product.id);
  const isLowStock = product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => !isOutOfStock && addToCart(product)}
      className={cn(
        "relative group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-card border border-border shadow-card hover:shadow-card-hover",
        "hover:-translate-y-1 active:scale-[0.98]",
        isOutOfStock && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl transition-transform duration-300 group-hover:scale-125">
              {product.emoji}
            </span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quantity badge */}
        {cartItem && (
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg animate-bounce-in z-10">
            {cartItem.quantity}
          </div>
        )}
        
        {/* Low stock warning */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-warning/90 text-warning-foreground text-xs font-bold flex items-center gap-1 shadow-lg">
            <AlertTriangle className="w-3 h-3" />
            {product.stock}
          </div>
        )}
        
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-full text-sm font-bold">
              Agotado
            </span>
          </div>
        )}
        
        {/* Short code badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-mono font-bold">
          {product.shortCode}
        </div>
        
        {/* Add button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            isOutOfStock ? "bg-destructive/10 text-destructive" : isLowStock ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
          )}>
            {isOutOfStock ? 'Sin stock' : `${product.stock} uds`}
          </span>
        </div>
      </div>
    </div>
  );
}
