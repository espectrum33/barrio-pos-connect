import { usePOS } from '@/context/POSContext';

export function Banners() {
  const { businessConfig } = usePOS();

  return (
    <div className="w-full">
      {/* Banner fijo grande */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent py-6 sm:py-10">
        <div className="absolute inset-0 opacity-20" 
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.4) 0%, transparent 60%)'
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
            🔥 ¡OFERTAS ESPECIALES! 🔥
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 drop-shadow">
            Aprovecha nuestras promociones del día
          </p>
        </div>
      </div>

      {/* Banner de texto animado */}
      <div className="bg-warning/90 py-2 overflow-hidden">
        <div className="animate-scroll-x whitespace-nowrap">
          <span className="inline-block text-warning-foreground font-bold text-sm sm:text-base px-4">
            🎉 ¡Bienvenidos a {businessConfig.businessName}! • 
            💚 Aceptamos Nequi, Daviplata y Transferencias • 
            📱 Pedidos por WhatsApp al {businessConfig.whatsappNumber || '300-123-4567'} • 
            🍔 2x1 en Hamburguesas los Miércoles • 
            🥤 Combo Familiar: Hamburguesa + Papas + Gaseosa por $22.000 • 
            🛵 Domicilios sin costo por compras mayores a $30.000 •
            ⭐ Clientes frecuentes acumulan puntos •
          </span>
          <span className="inline-block text-warning-foreground font-bold text-sm sm:text-base px-4">
            🎉 ¡Bienvenidos a {businessConfig.businessName}! • 
            💚 Aceptamos Nequi, Daviplata y Transferencias • 
            📱 Pedidos por WhatsApp al {businessConfig.whatsappNumber || '300-123-4567'} • 
            🍔 2x1 en Hamburguesas los Miércoles • 
            🥤 Combo Familiar: Hamburguesa + Papas + Gaseosa por $22.000 • 
            🛵 Domicilios sin costo por compras mayores a $30.000 •
            ⭐ Clientes frecuentes acumulan puntos •
          </span>
        </div>
      </div>
    </div>
  );
}
