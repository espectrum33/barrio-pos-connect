import { ShoppingCart, Settings, ClipboardList, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { formatCurrency } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function Header() {
  const { businessConfig, cart, cartOpen, setCartOpen, currentView, setCurrentView, cartTotal, orders } = usePOS();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'pending').length;

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-elevated">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black truncate">{businessConfig.businessName}</h1>
            <p className="text-xs sm:text-sm opacity-90 truncate hidden sm:block">{businessConfig.businessSlogan}</p>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              className={cn(
                "text-primary-foreground hover:bg-white/20",
                currentView === 'cashier' && "bg-white/20"
              )}
              onClick={() => setCurrentView('cashier')}
            >
              💰 Caja
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "text-primary-foreground hover:bg-white/20 relative",
                currentView === 'orders' && "bg-white/20"
              )}
              onClick={() => setCurrentView('orders')}
            >
              📋 Pedidos
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center font-bold animate-pulse-scale">
                  {pendingOrders}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className={cn(
                "text-primary-foreground hover:bg-white/20",
                currentView === 'admin' && "bg-white/20"
              )}
              onClick={() => setCurrentView('admin')}
            >
              ⚙️ Admin
            </Button>
          </nav>
          
          {/* Cart button */}
          <Button
            onClick={() => setCartOpen(!cartOpen)}
            className={cn(
              "bg-white/20 hover:bg-white/30 text-primary-foreground relative",
              cartOpen && "bg-white/30"
            )}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">{formatCurrency(cartTotal)}</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary rounded-full text-sm flex items-center justify-center font-bold">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
