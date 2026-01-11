import { ShoppingCart, Settings, ClipboardList, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { cart, cartOpen, setCartOpen, currentView, setCurrentView, orders } = usePOS();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'pending').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border lg:hidden safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        <Button
          variant="ghost"
          className={cn(
            "flex-1 h-full flex-col gap-0.5 rounded-none",
            currentView === 'cashier' && "text-primary bg-primary/10"
          )}
          onClick={() => setCurrentView('cashier')}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Caja</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "flex-1 h-full flex-col gap-0.5 rounded-none relative",
            currentView === 'orders' && "text-primary bg-primary/10"
          )}
          onClick={() => setCurrentView('orders')}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-xs">Pedidos</span>
          {pendingOrders > 0 && (
            <span className="absolute top-2 right-1/4 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-bold animate-pulse-scale">
              {pendingOrders}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "flex-1 h-full flex-col gap-0.5 rounded-none relative",
            cartOpen && "text-primary bg-primary/10"
          )}
          onClick={() => setCartOpen(!cartOpen)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs">Carrito</span>
          {cartItemsCount > 0 && (
            <span className="absolute top-2 right-1/4 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "flex-1 h-full flex-col gap-0.5 rounded-none",
            currentView === 'admin' && "text-primary bg-primary/10"
          )}
          onClick={() => setCurrentView('admin')}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Admin</span>
        </Button>
      </div>
    </nav>
  );
}
