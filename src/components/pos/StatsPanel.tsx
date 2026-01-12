import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, Users, Clock, BarChart3 } from 'lucide-react';
import { usePOS } from '@/context/POSContext';
import { formatCurrency } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

function StatCard({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }: StatCardProps) {
  return (
    <div className="card-elevated p-4 sm:p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2.5 rounded-xl",
          color === 'primary' && "bg-primary/10 text-primary",
          color === 'success' && "bg-success/10 text-success",
          color === 'warning' && "bg-warning/10 text-warning",
          color === 'accent' && "bg-accent/10 text-accent"
        )}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-success/10 text-success",
            trend === 'down' && "bg-destructive/10 text-destructive",
            trend === 'neutral' && "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <p className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface TopProductProps {
  rank: number;
  emoji: string;
  name: string;
  sold: number;
  revenue: number;
}

function TopProductItem({ rank, emoji, name, sold, revenue }: TopProductProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <span className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        rank === 1 && "bg-yellow-400 text-yellow-900",
        rank === 2 && "bg-gray-300 text-gray-700",
        rank === 3 && "bg-amber-600 text-amber-100",
        rank > 3 && "bg-muted-foreground/20 text-muted-foreground"
      )}>
        {rank}
      </span>
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{sold} vendidos</p>
      </div>
      <p className="font-bold text-primary text-sm">{formatCurrency(revenue)}</p>
    </div>
  );
}

export function StatsPanel() {
  const { sales, products, orders, customers } = usePOS();

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's sales
    const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const todayCount = todaySales.length;

    // This week's sales
    const weekSales = sales.filter(s => new Date(s.date) >= startOfWeek);
    const weekTotal = weekSales.reduce((sum, s) => sum + s.total, 0);

    // This month's sales
    const monthSales = sales.filter(s => new Date(s.date) >= startOfMonth);
    const monthTotal = monthSales.reduce((sum, s) => sum + s.total, 0);

    // Average ticket
    const avgTicket = sales.length > 0 ? sales.reduce((sum, s) => sum + s.total, 0) / sales.length : 0;

    // Top products
    const topProducts = [...products]
      .filter(p => p.timesSold > 0)
      .sort((a, b) => b.timesSold - a.timesSold)
      .slice(0, 5)
      .map((p, idx) => ({
        rank: idx + 1,
        emoji: p.emoji,
        name: p.name,
        sold: p.timesSold,
        revenue: p.timesSold * p.price,
      }));

    // Low stock products
    const lowStockProducts = products.filter(p => p.active && p.stock <= p.minStockAlert);

    // Pending orders
    const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'pending');

    // Payment methods breakdown
    const paymentBreakdown = sales.reduce((acc, sale) => {
      acc[sale.payment] = (acc[sale.payment] || 0) + sale.total;
      return acc;
    }, {} as Record<string, number>);

    // Sales by hour (for peak hours)
    const salesByHour = sales.reduce((acc, sale) => {
      const hour = new Date(sale.date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(salesByHour).sort(([, a], [, b]) => b - a)[0];

    return {
      todayTotal,
      todayCount,
      weekTotal,
      monthTotal,
      avgTicket,
      topProducts,
      lowStockProducts,
      pendingOrders,
      paymentBreakdown,
      peakHour: peakHour ? `${peakHour[0]}:00` : 'N/A',
      totalProducts: products.filter(p => p.active).length,
      totalCustomers: customers.length,
    };
  }, [sales, products, orders, customers]);

  const paymentLabels: Record<string, { label: string; emoji: string }> = {
    efectivo: { label: 'Efectivo', emoji: '💵' },
    nequi: { label: 'Nequi', emoji: '💚' },
    transferencia: { label: 'Transferencia', emoji: '🏦' },
    daviplata: { label: 'Daviplata', emoji: '💜' },
  };

  return (
    <div className="space-y-6">
      {/* Main stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas Hoy"
          value={formatCurrency(stats.todayTotal)}
          subtitle={`${stats.todayCount} transacciones`}
          icon={<DollarSign className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Esta Semana"
          value={formatCurrency(stats.weekTotal)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Este Mes"
          value={formatCurrency(stats.monthTotal)}
          icon={<BarChart3 className="w-5 h-5" />}
          color="accent"
        />
        <StatCard
          title="Ticket Promedio"
          value={formatCurrency(stats.avgTicket)}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <p className="text-3xl font-display font-bold text-foreground">{stats.totalProducts}</p>
          <p className="text-sm text-muted-foreground">Productos Activos</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-3xl font-display font-bold text-foreground">{stats.totalCustomers}</p>
          <p className="text-sm text-muted-foreground">Clientes</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-3xl font-display font-bold text-warning">{stats.lowStockProducts.length}</p>
          <p className="text-sm text-muted-foreground">Stock Bajo</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <p className="text-3xl font-display font-bold text-foreground">{stats.peakHour}</p>
          <p className="text-sm text-muted-foreground">Hora Pico</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card-elevated p-5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Productos Más Vendidos
          </h3>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-2">
              {stats.topProducts.map((product) => (
                <TopProductItem key={product.rank} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sin datos de ventas aún</p>
            </div>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="card-elevated p-5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Métodos de Pago
          </h3>
          {Object.keys(stats.paymentBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.paymentBreakdown).map(([method, total]) => {
                const info = paymentLabels[method] || { label: method, emoji: '💳' };
                const percentage = (total / stats.monthTotal) * 100;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{info.emoji}</span>
                        <span className="font-medium">{info.label}</span>
                      </span>
                      <span className="font-bold">{formatCurrency(total)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          method === 'nequi' && "bg-nequi",
                          method === 'efectivo' && "bg-secondary",
                          method === 'transferencia' && "bg-accent",
                          method === 'daviplata' && "bg-daviplata"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sin pagos registrados aún</p>
            </div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {stats.lowStockProducts.length > 0 && (
        <div className="card-elevated p-5 border-l-4 border-l-warning">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2 text-warning">
            <Package className="w-5 h-5" />
            ⚠️ Productos con Stock Bajo ({stats.lowStockProducts.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg">
                <span className="text-xl">{product.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs font-bold text-warning">{product.stock} unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
