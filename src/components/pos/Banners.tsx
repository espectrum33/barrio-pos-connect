import { usePOS } from '@/context/POSContext';
import { Zap, Gift, Truck, Star } from 'lucide-react';

export function Banners() {
  const { businessConfig } = usePOS();

  const promoItems = [
    { icon: '🎉', text: `¡Bienvenidos a ${businessConfig.businessName}!` },
    { icon: '💚', text: 'Aceptamos Nequi, Daviplata y Transferencias' },
    { icon: '📱', text: `Pedidos por WhatsApp al ${businessConfig.whatsappNumber || '300-123-4567'}` },
    { icon: '🍔', text: '2x1 en Hamburguesas los Miércoles' },
    { icon: '🥤', text: 'Combo Familiar: Hamburguesa + Papas + Gaseosa $22.000' },
    { icon: '🛵', text: 'Domicilios GRATIS por compras mayores a $30.000' },
    { icon: '⭐', text: 'Clientes frecuentes acumulan puntos' },
  ];

  return (
    <div className="w-full">
      {/* Hero banner with gradient */}
      <div className="relative overflow-hidden gradient-hero">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 py-8 sm:py-12 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            {/* Main headline */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium shadow-inner-glow">
                <Zap className="w-4 h-4" />
                <span>Ofertas del día</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white drop-shadow-lg animate-slide-down">
                🔥 ¡SUPER OFERTAS! 🔥
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 drop-shadow animate-fade-in">
              Aprovecha nuestras promociones especiales
            </p>
            
            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg animate-bounce-in" style={{ animationDelay: '100ms' }}>
                <Gift className="w-4 h-4" />
                2x1 en combos
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg animate-bounce-in" style={{ animationDelay: '200ms' }}>
                <Truck className="w-4 h-4" />
                Envío gratis +$30k
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg animate-bounce-in" style={{ animationDelay: '300ms' }}>
                <Star className="w-4 h-4" />
                Puntos x compra
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling text banner */}
      <div className="bg-foreground py-2.5 overflow-hidden shadow-md">
        <div className="animate-scroll-x whitespace-nowrap flex">
          {[...promoItems, ...promoItems].map((item, index) => (
            <span 
              key={index} 
              className="inline-flex items-center text-background font-semibold text-sm px-6"
            >
              <span className="mr-2">{item.icon}</span>
              {item.text}
              <span className="mx-6 text-primary">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
