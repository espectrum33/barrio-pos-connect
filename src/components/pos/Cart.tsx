import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, CreditCard, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { formatCurrency, generateOrderConfirmation, generatePaymentInstructions, generateWhatsAppLink, copyToClipboard, getPaymentMethodLabel } from '@/lib/whatsapp';
import { PaymentMethod } from '@/types/pos';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Cart() {
  const { cart, cartTotal, cartOpen, setCartOpen, updateCartQuantity, removeFromCart, clearCart, createSale, paymentConfig, businessConfig } = usePOS();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderCode, setOrderCode] = useState('');

  const handlePayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const confirmSale = () => {
    if (!selectedPayment) return;
    const sale = createSale(cart, selectedPayment, customerName || undefined, customerPhone || undefined);
    setOrderCode(sale.code);
    setShowPayment(false);
    setSelectedPayment(null);
    setCustomerName('');
    setCustomerPhone('');
    setCartOpen(false);
    toast.success(`✅ Venta ${sale.code} completada`);
  };

  const handleCopyConfirmation = async () => {
    const message = generateOrderConfirmation(
      orderCode || 'TEMP-' + Date.now().toString(36).toUpperCase(),
      cart,
      cartTotal,
      businessConfig.businessName
    );
    const success = await copyToClipboard(message);
    if (success) {
      toast.success('📋 Mensaje copiado');
    } else {
      toast.error('Error al copiar');
    }
  };

  const handleCopyPaymentInstructions = async (method: PaymentMethod) => {
    const message = generatePaymentInstructions(method, cartTotal, paymentConfig);
    const success = await copyToClipboard(message);
    if (success) {
      toast.success('📋 Instrucciones copiadas');
    } else {
      toast.error('Error al copiar');
    }
  };

  const handleOpenWhatsApp = () => {
    if (!businessConfig.whatsappNumber) {
      toast.error('Configure el número de WhatsApp');
      return;
    }
    const message = generateOrderConfirmation(
      orderCode || 'TEMP-' + Date.now().toString(36).toUpperCase(),
      cart,
      cartTotal,
      businessConfig.businessName
    );
    const link = generateWhatsAppLink(businessConfig.whatsappNumber, message);
    window.open(link, '_blank');
  };

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Cart panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full sm:w-96 bg-card z-50 shadow-elevated flex flex-col animate-slide-in-right"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🛒 Carrito
            {cart.length > 0 && (
              <span className="bg-primary-foreground text-primary px-2 py-0.5 rounded-full text-sm">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <span className="text-5xl mb-3">🛒</span>
              <p className="text-lg font-medium">Carrito vacío</p>
              <p className="text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="card-elevated p-3 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-primary font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/50 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(cartTotal)}</span>
            </div>
            
            {/* WhatsApp actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopyConfirmation}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Pedido
              </Button>
              <Button
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            
            {/* Pay button */}
            <Button
              className="w-full h-14 text-lg font-bold gradient-primary hover:opacity-90"
              onClick={() => setShowPayment(true)}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar {formatCurrency(cartTotal)}
            </Button>
            
            {/* Clear cart */}
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={clearCart}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>
        )}
      </div>

      {/* Payment dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">💳 Método de Pago</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Customer info */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">Nombre (opcional)</Label>
                <Input
                  id="customerName"
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono (opcional)</Label>
                <Input
                  id="customerPhone"
                  placeholder="300 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
            
            {/* Payment methods */}
            <div className="grid grid-cols-2 gap-3">
              {paymentConfig.nequiEnabled && (
                <Button
                  variant={selectedPayment === 'nequi' ? 'default' : 'outline'}
                  className={cn(
                    "h-16 flex-col",
                    selectedPayment === 'nequi' && "bg-nequi hover:bg-nequi/90"
                  )}
                  onClick={() => handlePayment('nequi')}
                >
                  <span className="text-lg">💚</span>
                  <span>Nequi</span>
                </Button>
              )}
              {paymentConfig.transferenciaEnabled && (
                <Button
                  variant={selectedPayment === 'transferencia' ? 'default' : 'outline'}
                  className={cn(
                    "h-16 flex-col",
                    selectedPayment === 'transferencia' && "bg-accent hover:bg-accent/90"
                  )}
                  onClick={() => handlePayment('transferencia')}
                >
                  <span className="text-lg">🏦</span>
                  <span>Transferencia</span>
                </Button>
              )}
              {paymentConfig.efectivoEnabled && (
                <Button
                  variant={selectedPayment === 'efectivo' ? 'default' : 'outline'}
                  className={cn(
                    "h-16 flex-col",
                    selectedPayment === 'efectivo' && "bg-secondary hover:bg-secondary/90"
                  )}
                  onClick={() => handlePayment('efectivo')}
                >
                  <span className="text-lg">💵</span>
                  <span>Efectivo</span>
                </Button>
              )}
              {paymentConfig.daviplataEnabled && (
                <Button
                  variant={selectedPayment === 'daviplata' ? 'default' : 'outline'}
                  className="h-16 flex-col"
                  onClick={() => handlePayment('daviplata')}
                >
                  <span className="text-lg">💜</span>
                  <span>Daviplata</span>
                </Button>
              )}
            </div>
            
            {/* Payment instructions */}
            {selectedPayment && selectedPayment !== 'efectivo' && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-sm whitespace-pre-line">
                    {generatePaymentInstructions(selectedPayment, cartTotal, paymentConfig).split('\n').slice(0, 5).join('\n')}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyPaymentInstructions(selectedPayment)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Confirm button */}
            <Button
              className="w-full h-12 text-lg font-bold"
              disabled={!selectedPayment}
              onClick={confirmSale}
            >
              ✅ Confirmar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
