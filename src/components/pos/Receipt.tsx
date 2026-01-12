import { CartItem, PaymentMethod, BusinessConfig } from '@/types/pos';
import { formatCurrency, getPaymentMethodLabel } from '@/lib/whatsapp';

interface ReceiptProps {
  sale: {
    code: string;
    items: CartItem[];
    total: number;
    payment: PaymentMethod;
    date: string;
    customerName?: string;
    customerPhone?: string;
  };
  businessConfig: BusinessConfig;
}

export function Receipt({ sale, businessConfig }: ReceiptProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div id="receipt-print" className="bg-white text-black p-6 rounded-xl font-mono text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
        <h2 className="text-xl font-bold">{businessConfig.businessName}</h2>
        {businessConfig.businessSlogan && (
          <p className="text-xs text-gray-600 mt-1">{businessConfig.businessSlogan}</p>
        )}
        {businessConfig.businessAddress && (
          <p className="text-xs text-gray-600">{businessConfig.businessAddress}</p>
        )}
        {businessConfig.businessPhone && (
          <p className="text-xs text-gray-600">Tel: {businessConfig.businessPhone}</p>
        )}
        {businessConfig.businessNit && (
          <p className="text-xs text-gray-600">NIT: {businessConfig.businessNit}</p>
        )}
      </div>

      {/* Receipt info */}
      <div className="border-b border-dashed border-gray-300 pb-3 mb-3">
        <div className="flex justify-between text-xs">
          <span className="font-bold">Recibo:</span>
          <span>{sale.code}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-bold">Fecha:</span>
          <span>{formatDate(sale.date)}</span>
        </div>
        {sale.customerName && (
          <div className="flex justify-between text-xs">
            <span className="font-bold">Cliente:</span>
            <span>{sale.customerName}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border-b border-dashed border-gray-300 pb-3 mb-3">
        <div className="text-xs font-bold mb-2 flex justify-between">
          <span>Producto</span>
          <span>Subtotal</span>
        </div>
        {sale.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs py-1">
            <div className="flex-1">
              <span>{item.name}</span>
              <span className="text-gray-600 ml-2">x{item.quantity}</span>
              <span className="text-gray-600 ml-1 text-[10px]">({formatCurrency(item.price)})</span>
            </div>
            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mb-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="border-t border-dashed border-gray-300 pt-3 mb-3">
        <div className="flex justify-between text-xs">
          <span className="font-bold">Método de pago:</span>
          <span>{getPaymentMethodLabel(sale.payment)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 pt-3 border-t border-dashed border-gray-300">
        <p className="font-bold">¡Gracias por su compra!</p>
        <p className="mt-1">Vuelva pronto 😊</p>
        {businessConfig.whatsappNumber && (
          <p className="mt-2">WhatsApp: {businessConfig.whatsappNumber}</p>
        )}
      </div>
    </div>
  );
}
