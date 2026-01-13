import { useState } from 'react';
import { MessageCircle, Check, X, Clock, Package, Truck, Send, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { 
  formatCurrency, 
  timeAgo, 
  getOrderStatusColor, 
  getOrderStatusLabel, 
  getPaymentMethodLabel, 
  generateWhatsAppLink, 
  copyToClipboard,
  generateStatusNotification 
} from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Order } from '@/types/pos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusFilters = [
  { value: 'all', label: '📋 Todos' },
  { value: 'new', label: '🔴 Nuevos' },
  { value: 'pending', label: '🟡 Pendientes' },
  { value: 'paid', label: '🟢 Pagados' },
  { value: 'ready', label: '🔵 Listos' },
  { value: 'completed', label: '⚫ Completados' },
];

const nextStatusMap: Record<string, { status: Order['status']; label: string; icon: React.ReactNode; color: string }> = {
  'new': { status: 'pending', label: 'Esperar Pago', icon: <Clock className="w-4 h-4" />, color: 'bg-warning text-warning-foreground hover:bg-warning/90' },
  'pending': { status: 'paid', label: 'Marcar Pagado', icon: <Check className="w-4 h-4" />, color: 'bg-success text-success-foreground hover:bg-success/90' },
  'paid': { status: 'ready', label: 'Marcar Listo', icon: <Package className="w-4 h-4" />, color: 'bg-accent text-accent-foreground hover:bg-accent/90' },
  'ready': { status: 'delivered', label: 'Entregar', icon: <Truck className="w-4 h-4" />, color: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  'delivered': { status: 'completed', label: 'Completar', icon: <Check className="w-4 h-4" />, color: 'bg-muted text-muted-foreground hover:bg-muted/90' },
};

export function OrdersPanel() {
  const { orders, updateOrderStatus, businessConfig } = usePOS();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders
    .filter(order => {
      if (statusFilter === 'all') return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingCount = orders.filter(o => o.status === 'new' || o.status === 'pending').length;

  const handleOpenWhatsApp = (order: Order, message?: string) => {
    if (!order.customerPhone) {
      toast.error('El cliente no tiene teléfono');
      return;
    }
    const defaultMessage = `Hola ${order.customerName}! Te escribo por tu pedido ${order.code}`;
    const link = generateWhatsAppLink(order.customerPhone, message || defaultMessage);
    window.open(link, '_blank');
  };

  const handleStatusChange = (order: Order, newStatus: Order['status']) => {
    updateOrderStatus(order.id, newStatus);
    
    // Generate notification message
    if (order.customerPhone) {
      const notification = generateStatusNotification(
        order.code,
        newStatus,
        order.customerName,
        businessConfig.businessName,
        order.total
      );
      
      // Copy to clipboard and show toast with option to send
      copyToClipboard(notification);
      toast.success(
        <div className="flex flex-col gap-2">
          <span>✅ Estado actualizado</span>
          <span className="text-xs opacity-80">Mensaje copiado al portapapeles</span>
          <Button
            size="sm"
            variant="outline"
            className="mt-1"
            onClick={() => handleOpenWhatsApp(order, notification)}
          >
            <Send className="w-3 h-3 mr-1" />
            Enviar por WhatsApp
          </Button>
        </div>,
        { duration: 5000 }
      );
    }
    
    setSelectedOrder(null);
  };

  const handleSendNotification = (order: Order, status: string) => {
    const notification = generateStatusNotification(
      order.code,
      status,
      order.customerName,
      businessConfig.businessName,
      order.total
    );
    handleOpenWhatsApp(order, notification);
  };

  const handleCopyNotification = async (order: Order, status: string) => {
    const notification = generateStatusNotification(
      order.code,
      status,
      order.customerName,
      businessConfig.businessName,
      order.total
    );
    const success = await copyToClipboard(notification);
    if (success) {
      toast.success('📋 Mensaje copiado');
    }
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
              
              {/* Items preview with images */}
              <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-muted rounded-lg p-2">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <span className="text-lg">{item.emoji}</span>
                    )}
                    <span className="text-xs font-medium">{item.quantity}x</span>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                    <span className="text-xs font-bold text-muted-foreground">+{order.items.length - 4}</span>
                  </div>
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
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      📱 {selectedOrder.customerPhone}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenWhatsApp(selectedOrder);
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </p>
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
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <span className="text-2xl">{item.emoji}</span>
                          )}
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
                
                {/* WhatsApp Notifications */}
                {selectedOrder.customerPhone && (
                  <div className="p-3 bg-whatsapp/10 rounded-lg">
                    <h4 className="font-semibold mb-2 text-whatsapp">💬 Notificar al cliente</h4>
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white">
                            <Send className="w-4 h-4 mr-2" />
                            Enviar mensaje
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleSendNotification(selectedOrder, 'pending')}>
                            🟡 Pedido recibido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendNotification(selectedOrder, 'paid')}>
                            🟢 Pago confirmado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendNotification(selectedOrder, 'ready')}>
                            📦 Pedido listo
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendNotification(selectedOrder, 'delivered')}>
                            🚀 Entregado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendNotification(selectedOrder, 'completed')}>
                            ⭐ Completado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar mensaje
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleCopyNotification(selectedOrder, 'pending')}>
                            🟡 Pedido recibido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyNotification(selectedOrder, 'paid')}>
                            🟢 Pago confirmado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyNotification(selectedOrder, 'ready')}>
                            📦 Pedido listo
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyNotification(selectedOrder, 'delivered')}>
                            🚀 Entregado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.customerPhone && (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenWhatsApp(selectedOrder)}
                      className="flex-1 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Abrir Chat
                    </Button>
                  )}
                  
                  {nextStatusMap[selectedOrder.status] && (
                    <Button
                      onClick={() => handleStatusChange(selectedOrder, nextStatusMap[selectedOrder.status].status)}
                      className={cn("flex-1", nextStatusMap[selectedOrder.status].color)}
                    >
                      {nextStatusMap[selectedOrder.status].icon}
                      <span className="ml-2">{nextStatusMap[selectedOrder.status].label}</span>
                    </Button>
                  )}
                  
                  {!['completed', 'cancelled'].includes(selectedOrder.status) && (
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedOrder, 'cancelled')}
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
