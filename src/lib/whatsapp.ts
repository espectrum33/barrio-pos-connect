import { PaymentConfig, PaymentMethod, CartItem, BusinessConfig } from '@/types/pos';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function generateOrderCode(): string {
  return 'PAY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function generateWhatsAppCatalog(
  products: { name: string; shortCode: string; price: number; stock: number; category: string; emoji: string; active: boolean }[],
  businessName: string,
  category: string = 'all',
  includeStock: boolean = true
): string {
  const categoryEmojis: Record<string, string> = {
    comida: '🍔',
    bebidas: '🥤',
    lacteos: '🥛',
    panaderia: '🍞',
    snacks: '🍿',
    granos: '🍚',
    aseo: '🧹',
  };

  const categoryNames: Record<string, string> = {
    comida: 'COMIDAS',
    bebidas: 'BEBIDAS',
    lacteos: 'LÁCTEOS',
    panaderia: 'PANADERÍA',
    snacks: 'SNACKS',
    granos: 'GRANOS',
    aseo: 'ASEO',
  };

  let catalog = `🏪 *CATÁLOGO ${businessName.toUpperCase()}*\n\n`;

  const activeProducts = products.filter(p => p.active && (category === 'all' || p.category === category));
  
  const groupedByCategory = activeProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  Object.entries(groupedByCategory).forEach(([cat, prods]) => {
    catalog += `${categoryEmojis[cat] || '📦'} *${categoryNames[cat] || cat.toUpperCase()}*\n`;
    prods.forEach(p => {
      const stockText = includeStock ? ` ✅ Stock: ${p.stock}` : '';
      catalog += `${p.shortCode} - ${p.name} - ${formatCurrency(p.price)}${stockText}\n`;
    });
    catalog += '\n';
  });

  catalog += `📱 *Para pedir, envía tu pedido con los códigos*\n`;
  catalog += `Ejemplo: HB x2, GS x1`;

  return catalog;
}

export function generateOrderConfirmation(
  orderCode: string,
  items: CartItem[],
  total: number,
  businessName: string
): string {
  let message = `✅ *PEDIDO CONFIRMADO*\n`;
  message += `📋 Código: ${orderCode}\n\n`;
  message += `*Productos:*\n`;
  
  items.forEach(item => {
    message += `• ${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}\n`;
  });
  
  message += `━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL: ${formatCurrency(total)}*\n\n`;
  message += `*¿Cómo vas a pagar?*\n`;
  message += `1️⃣ Nequi\n`;
  message += `2️⃣ Transferencia\n`;
  message += `3️⃣ Efectivo en entrega\n\n`;
  message += `Responde con el número de tu opción 👆`;

  return message;
}

export function generatePaymentInstructions(
  method: PaymentMethod,
  total: number,
  config: PaymentConfig
): string {
  switch (method) {
    case 'nequi':
      return `💚 *PAGO POR NEQUI*\n\n` +
        `📱 Número: ${formatPhone(config.nequiNumber)}\n` +
        `👤 Titular: ${config.nequiHolder}\n` +
        `💰 Valor: ${formatCurrency(total)}\n\n` +
        `📸 Envía captura del comprobante cuando pagues\n\n` +
        `✅ Tu pedido se confirmará al validar el pago`;
    
    case 'transferencia':
      return `🏦 *PAGO POR TRANSFERENCIA*\n\n` +
        `🏢 Banco: ${config.bankName}\n` +
        `💳 Cuenta: ${config.bankAccount}\n` +
        `📋 Tipo: ${config.bankAccountType === 'ahorros' ? 'Ahorros' : 'Corriente'}\n` +
        `👤 Titular: ${config.bankHolder}\n` +
        `💰 Valor: ${formatCurrency(total)}\n\n` +
        `📸 Envía comprobante de la transferencia`;
    
    case 'efectivo':
      return `💵 *PAGO EN EFECTIVO*\n\n` +
        `💰 Valor a pagar: ${formatCurrency(total)}\n\n` +
        `${config.efectivoMessage || 'Trae el valor exacto por favor'}\n\n` +
        `✅ Paga al recibir tu pedido`;
    
    case 'daviplata':
      return `💜 *PAGO POR DAVIPLATA*\n\n` +
        `📱 Número: ${formatPhone(config.daviplataNumber)}\n` +
        `👤 Titular: ${config.daviplataHolder}\n` +
        `💰 Valor: ${formatCurrency(total)}\n\n` +
        `📸 Envía captura del comprobante cuando pagues`;
    
    default:
      return '';
  }
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

interface ParsedOrderItem {
  shortCode: string;
  quantity: number;
  found: boolean;
  productName?: string;
}

export function parseWhatsAppOrder(
  message: string,
  products: { shortCode: string; name: string }[]
): ParsedOrderItem[] {
  const patterns = [
    /([A-Za-z]{2})\s*[xX]\s*(\d+)/gi,
    /(\d+)\s*[xX]?\s*([A-Za-z]{2})/gi,
    /([A-Za-z]{2})\s+(\d+)/gi,
  ];

  const results: ParsedOrderItem[] = [];
  const found = new Set<string>();

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(message)) !== null) {
      let code: string;
      let qty: number;
      
      if (/^\d+$/.test(match[1])) {
        qty = parseInt(match[1]);
        code = match[2].toUpperCase();
      } else {
        code = match[1].toUpperCase();
        qty = parseInt(match[2]);
      }

      if (!found.has(code)) {
        const product = products.find(p => p.shortCode.toUpperCase() === code);
        results.push({
          shortCode: code,
          quantity: qty,
          found: !!product,
          productName: product?.name,
        });
        found.add(code);
      }
    }
  }

  return results;
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'new': return 'bg-status-new text-white';
    case 'pending': return 'bg-status-pending text-foreground';
    case 'paid': return 'bg-status-paid text-white';
    case 'ready': return 'bg-status-ready text-white';
    case 'delivered': return 'bg-secondary text-secondary-foreground';
    case 'completed': return 'bg-status-completed text-white';
    case 'cancelled': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function getOrderStatusLabel(status: string): string {
  switch (status) {
    case 'new': return '🔴 Nuevo';
    case 'pending': return '🟡 Pago Pendiente';
    case 'paid': return '🟢 Pagado';
    case 'ready': return '🔵 Listo';
    case 'delivered': return '✅ Entregado';
    case 'completed': return '⚫ Completado';
    case 'cancelled': return '❌ Cancelado';
    default: return status;
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'nequi': return '💚 Nequi';
    case 'transferencia': return '🏦 Transferencia';
    case 'efectivo': return '💵 Efectivo';
    case 'daviplata': return '💜 Daviplata';
    default: return method;
  }
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Hace un momento';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
  return `Hace ${Math.floor(seconds / 86400)} días`;
}

// WhatsApp notification messages for order status updates
export function generateStatusNotification(
  orderCode: string,
  status: string,
  customerName: string,
  businessName: string,
  total?: number
): string {
  const name = customerName || 'Cliente';
  
  switch (status) {
    case 'pending':
      return `⏳ Hola ${name}!\n\n` +
        `Tu pedido *${orderCode}* ha sido recibido en *${businessName}*.\n\n` +
        `💰 Total: ${total ? formatCurrency(total) : ''}\n\n` +
        `Estamos esperando la confirmación de tu pago.\n` +
        `📸 Envía tu comprobante cuando pagues.\n\n` +
        `¡Gracias por tu preferencia! 🙏`;
    
    case 'paid':
      return `✅ Hola ${name}!\n\n` +
        `¡Recibimos tu pago! Tu pedido *${orderCode}* está confirmado.\n\n` +
        `👨‍🍳 Ya estamos preparando tu pedido.\n` +
        `Te avisaremos cuando esté listo.\n\n` +
        `¡Gracias por confiar en *${businessName}*! 🎉`;
    
    case 'ready':
      return `🎉 Hola ${name}!\n\n` +
        `¡Tu pedido *${orderCode}* está LISTO!\n\n` +
        `📦 Puedes pasar a recogerlo o espera tu domicilio.\n\n` +
        `¡Te esperamos en *${businessName}*! 🏪`;
    
    case 'delivered':
      return `🚀 Hola ${name}!\n\n` +
        `Tu pedido *${orderCode}* ha sido entregado.\n\n` +
        `¡Gracias por tu compra en *${businessName}*! ❤️\n\n` +
        `Esperamos verte pronto de nuevo. 🙌`;
    
    case 'completed':
      return `⭐ Hola ${name}!\n\n` +
        `Tu pedido *${orderCode}* ha sido completado.\n\n` +
        `¡Gracias por comprar en *${businessName}*! 🎊\n\n` +
        `¿Te gustó? ¡Cuéntanos tu experiencia! 💬`;
    
    case 'cancelled':
      return `❌ Hola ${name}.\n\n` +
        `Tu pedido *${orderCode}* ha sido cancelado.\n\n` +
        `Si tienes alguna pregunta, contáctanos.\n\n` +
        `*${businessName}*`;
    
    default:
      return `📋 Actualización de tu pedido *${orderCode}*\n\n` +
        `Estado: ${status}\n\n` +
        `*${businessName}*`;
  }
}
