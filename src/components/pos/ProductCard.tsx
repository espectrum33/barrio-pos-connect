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
    <button
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={cn(
        "card-elevated p-4 flex flex-col items-center gap-2 transition-all duration-200 btn-touch relative group",
        "hover:shadow-card-hover hover:-translate-y-1 active:translate-y-0",
        isOutOfStock && "opacity-50 cursor-not-allowed",
        cartItem && "ring-2 ring-primary"
      )}
    >
      {/* Badge for quantity in cart */}
      {cartItem && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold animate-slide-up">
          {cartItem.quantity}
        </div>
      )}
      
      {/* Low stock warning */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-warning text-warning-foreground text-[10px] font-bold rounded">
          ⚠️ Poco stock
        </div>
      )}
      
      {/* Product emoji */}
      <span className="text-4xl sm:text-5xl transition-transform group-hover:scale-110">
        {product.emoji}
      </span>
      
      {/* Short code */}
      <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">
        {product.shortCode}
      </span>
      
      {/* Name */}
      <span className="font-semibold text-sm text-center text-foreground leading-tight line-clamp-2">
        {product.name}
      </span>
      
      {/* Price */}
      <span className="text-lg font-bold text-primary">
        {formatCurrency(product.price)}
      </span>
      
      {/* Stock */}
      <span className={cn(
        "text-xs",
        isOutOfStock ? "text-destructive font-bold" : "text-muted-foreground"
      )}>
        {isOutOfStock ? 'Sin stock' : `Stock: ${product.stock}`}
      </span>
    </button>
  );
}
