import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, CreditCard, Copy, Printer, CheckCircle } from 'lucide-react';
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
import { Receipt } from './Receipt';

export function Cart() {
  const { cart, cartTotal, cartOpen, setCartOpen, updateCartQuantity, removeFromCart, clearCart, createSale, paymentConfig, businessConfig } = usePOS();
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lastSale, setLastSale] = useState<{ code: string; items: typeof cart; total: number; payment: PaymentMethod } | null>(null);

  const handlePayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const confirmSale = () => {
    if (!selectedPayment) return;
    const sale = createSale(cart, selectedPayment, customerName || undefined, customerPhone || undefined);
    setLastSale({ code: sale.code, items: [...cart], total: sale.total, payment: selectedPayment });
    setShowPayment(false);
    setSelectedPayment(null);
    setCustomerName('');
    setCustomerPhone('');
    setCartOpen(false);
    setShowReceipt(true);
    toast.success(`✅ Venta ${sale.code} completada`);
  };

  const handleCopyConfirmation = async () => {
    const code = lastSale?.code || 'TEMP-' + Date.now().toString(36).toUpperCase();
    const message = generateOrderConfirmation(code, cart, cartTotal, businessConfig.businessName);
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
    const code = lastSale?.code || 'TEMP-' + Date.now().toString(36).toUpperCase();
    const message = generateOrderConfirmation(code, cart, cartTotal, businessConfig.businessName);
    const link = generateWhatsAppLink(businessConfig.whatsappNumber, message);
    window.open(link, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!cartOpen) return (
    <>
      {/* Receipt modal after sale */}
      {showReceipt && lastSale && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                ¡Venta Exitosa!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Receipt 
                sale={{
                  code: lastSale.code,
                  items: lastSale.items,
                  total: lastSale.total,
                  payment: lastSale.payment,
                  date: new Date().toISOString(),
                }}
                businessConfig={businessConfig}
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button className="flex-1" onClick={() => setShowReceipt(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Cart panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full sm:w-[420px] bg-card z-50 shadow-elevated flex flex-col animate-slide-in-right"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border gradient-hero">
          <h2 className="text-xl font-display font-bold flex items-center gap-3 text-white">
            <span className="text-2xl">🛒</span>
            Carrito
            {cart.length > 0 && (
              <span className="bg-white text-primary px-2.5 py-0.5 rounded-full text-sm font-bold shadow-inner">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(false)}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-fade-in">
              <span className="text-7xl mb-4 animate-float">🛒</span>
              <p className="text-xl font-display font-semibold">Carrito vacío</p>
              <p className="text-sm mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className="card-elevated p-4 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-full"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 rounded-full"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border bg-muted/30 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-muted-foreground">Total:</span>
              <span className="text-3xl font-display font-bold text-primary">{formatCurrency(cartTotal)}</span>
            </div>
            
            {/* WhatsApp actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={handleCopyConfirmation}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                className="flex-1 h-11 bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground shadow-glow-success"
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            
            {/* Pay button */}
            <Button
              className="w-full h-14 text-lg font-display font-bold gradient-primary hover:opacity-90 shadow-glow transition-all duration-300"
              onClick={() => setShowPayment(true)}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar {formatCurrency(cartTotal)}
            </Button>
            
            {/* Clear cart */}
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-destructive"
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
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <span className="text-2xl">💳</span>
              Método de Pago
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* Customer info */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">Nombre (opcional)</Label>
                <Input
                  id="customerName"
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono (opcional)</Label>
                <Input
                  id="customerPhone"
                  placeholder="300 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
            
            {/* Payment methods */}
            <div className="grid grid-cols-2 gap-3">
              {paymentConfig.nequiEnabled && (
                <Button
                  variant={selectedPayment === 'nequi' ? 'default' : 'outline'}
                  className={cn(
                    "h-20 flex-col gap-1 rounded-xl transition-all duration-200",
                    selectedPayment === 'nequi' && "gradient-nequi border-0 shadow-lg scale-105"
                  )}
                  onClick={() => handlePayment('nequi')}
                >
                  <span className="text-2xl">💚</span>
                  <span className="font-semibold">Nequi</span>
                </Button>
              )}
              {paymentConfig.transferenciaEnabled && (
                <Button
                  variant={selectedPayment === 'transferencia' ? 'default' : 'outline'}
                  className={cn(
                    "h-20 flex-col gap-1 rounded-xl transition-all duration-200",
                    selectedPayment === 'transferencia' && "bg-accent hover:bg-accent/90 shadow-lg scale-105"
                  )}
                  onClick={() => handlePayment('transferencia')}
                >
                  <span className="text-2xl">🏦</span>
                  <span className="font-semibold">Transferencia</span>
                </Button>
              )}
              {paymentConfig.efectivoEnabled && (
                <Button
                  variant={selectedPayment === 'efectivo' ? 'default' : 'outline'}
                  className={cn(
                    "h-20 flex-col gap-1 rounded-xl transition-all duration-200",
                    selectedPayment === 'efectivo' && "bg-secondary hover:bg-secondary/90 shadow-lg scale-105"
                  )}
                  onClick={() => handlePayment('efectivo')}
                >
                  <span className="text-2xl">💵</span>
                  <span className="font-semibold">Efectivo</span>
                </Button>
              )}
              {paymentConfig.daviplataEnabled && (
                <Button
                  variant={selectedPayment === 'daviplata' ? 'default' : 'outline'}
                  className={cn(
                    "h-20 flex-col gap-1 rounded-xl transition-all duration-200",
                    selectedPayment === 'daviplata' && "gradient-daviplata border-0 shadow-lg scale-105"
                  )}
                  onClick={() => handlePayment('daviplata')}
                >
                  <span className="text-2xl">💜</span>
                  <span className="font-semibold">Daviplata</span>
                </Button>
              )}
            </div>
            
            {/* Payment instructions */}
            {selectedPayment && selectedPayment !== 'efectivo' && (
              <div className="p-4 bg-muted rounded-xl animate-slide-up">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm whitespace-pre-line flex-1">
                    {generatePaymentInstructions(selectedPayment, cartTotal, paymentConfig).split('\n').slice(0, 6).join('\n')}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => handleCopyPaymentInstructions(selectedPayment)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Confirm button */}
            <Button
              className="w-full h-14 text-lg font-display font-bold shadow-lg"
              disabled={!selectedPayment}
              onClick={confirmSale}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirmar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt modal */}
      {showReceipt && lastSale && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                ¡Venta Exitosa!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Receipt 
                sale={{
                  code: lastSale.code,
                  items: lastSale.items,
                  total: lastSale.total,
                  payment: lastSale.payment,
                  date: new Date().toISOString(),
                }}
                businessConfig={businessConfig}
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
                <Button className="flex-1" onClick={() => setShowReceipt(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
