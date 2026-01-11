import { useState } from 'react';
import { MessageCircle, Check, X, Clock, Package, Truck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { formatCurrency, timeAgo, getOrderStatusColor, getOrderStatusLabel, getPaymentMethodLabel, generateWhatsAppLink, copyToClipboard } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Order } from '@/types/pos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusFilters = [
  { value: 'all', label: '📋 Todos' },
  { value: 'new', label: '🔴 Nuevos' },
  { value: 'pending', label: '🟡 Pendientes' },
  { value: 'paid', label: '🟢 Pagados' },
  { value: 'ready', label: '🔵 Listos' },
  { value: 'completed', label: '⚫ Completados' },
];

export function OrdersPanel() {
  const { orders, updateOrderStatus, businessConfig, paymentConfig } = usePOS();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const pendingCount = orders.filter(o => o.status === 'new' || o.status === 'pending').length;

  const handleOpenWhatsApp = (order: Order) => {
    if (!order.customerPhone) {
      toast.error('El cliente no tiene teléfono');
      return;
    }
    const link = generateWhatsAppLink(order.customerPhone, `Hola ${order.customerName}! Te escribo por tu pedido ${order.code}`);
    window.open(link, '_blank');
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setSelectedOrder(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            📋 Pedidos
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground rounded-full text-sm font-bold animate-pulse-scale">
                {pendingCount} pendientes
              </span>
            )}
          </h2>
        </div>
        
        {/* Status filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {statusFilters.map(filter => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Orders list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <span className="text-5xl mb-3">📭</span>
            <p className="text-lg font-medium">Sin pedidos</p>
            <p className="text-sm">Los nuevos pedidos aparecerán aquí</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="card-elevated p-4 animate-slide-up cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", getOrderStatusColor(order.status))}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                </div>
                <span className="font-mono text-sm font-bold">{order.code}</span>
              </div>
              
              {/* Customer info */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                <span className="font-semibold">👤 {order.customerName || 'Sin nombre'}</span>
                {order.customerPhone && (
                  <span className="text-muted-foreground">📱 {order.customerPhone}</span>
                )}
              </div>
              
              {/* Items preview */}
              <div className="flex flex-wrap gap-1 mb-3">
                {order.items.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                    {item.quantity}x {item.name}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    +{order.items.length - 3} más
                  </span>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm">{getPaymentMethodLabel(order.payment)}</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Pedido {selectedOrder.code}</span>
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", getOrderStatusColor(selectedOrder.status))}>
                    {getOrderStatusLabel(selectedOrder.status)}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Customer */}
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">👤 Cliente</h4>
                  <p className="font-medium">{selectedOrder.customerName || 'Sin nombre'}</p>
                  {selectedOrder.customerPhone && (
                    <p className="text-sm text-muted-foreground">📱 {selectedOrder.customerPhone}</p>
                  )}
                  {selectedOrder.customerAddress && (
                    <p className="text-sm text-muted-foreground">📍 {selectedOrder.customerAddress}</p>
                  )}
                </div>
                
                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-2">📦 Productos</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                        <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.total)}</span>
                </div>
                
                {/* Payment */}
                <div className="p-3 bg-muted rounded-lg">
                  <span className="font-semibold">💳 Método de pago:</span>
                  <span className="ml-2">{getPaymentMethodLabel(selectedOrder.payment)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.customerPhone && (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenWhatsApp(selectedOrder)}
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Abrir Chat
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'new' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                      className="flex-1 bg-warning text-warning-foreground hover:bg-warning/90"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Esperar Pago
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'pending' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, 'paid')}
                      className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Marcar Pagado
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'paid' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, 'ready')}
                      className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Listo para Entregar
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'ready' && (
                    <Button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      className="flex-1"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Completar
                    </Button>
                  )}
                  
                  {!['completed', 'cancelled'].includes(selectedOrder.status) && (
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
