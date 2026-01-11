import { POSProvider, usePOS } from '@/context/POSContext';
import { Header } from '@/components/pos/Header';
import { MobileNav } from '@/components/pos/MobileNav';
import { Cart } from '@/components/pos/Cart';
import { CashierView } from '@/components/pos/CashierView';
import { OrdersPanel } from '@/components/pos/OrdersPanel';
import { AdminPanel } from '@/components/pos/AdminPanel';
import { Toaster } from '@/components/ui/sonner';

function POSApp() {
  const { currentView } = usePOS();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
        {currentView === 'cashier' && <CashierView />}
        {currentView === 'orders' && <OrdersPanel />}
        {currentView === 'admin' && <AdminPanel />}
      </main>
      
      <Cart />
      <MobileNav />
    </div>
  );
}

const Index = () => {
  return (
    <POSProvider>
      <POSApp />
      <Toaster position="top-right" richColors />
    </POSProvider>
  );
};

export default Index;
