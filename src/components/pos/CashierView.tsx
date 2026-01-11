import { ProductGrid } from './ProductGrid';
import { WhatsAppPanel } from './WhatsAppPanel';
import { Banners } from './Banners';
import { usePOS } from '@/context/POSContext';

export function CashierView() {
  const { currentView } = usePOS();

  if (currentView !== 'cashier') return null;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Main product area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Banners />
        <ProductGrid />
      </div>
      
      {/* WhatsApp panel - desktop only */}
      <div className="hidden lg:block w-80 border-l border-border">
        <WhatsAppPanel />
      </div>
    </div>
  );
}
