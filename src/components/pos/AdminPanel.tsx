import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePOS } from '@/context/POSContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/whatsapp';
import { StatsPanel } from './StatsPanel';

const COLOMBIAN_BANKS = [
  'Bancolombia',
  'Banco de Bogotá',
  'Davivienda',
  'BBVA',
  'Banco de Occidente',
  'Banco Popular',
  'Scotiabank',
  'Banco Caja Social',
  'Banco Agrario',
  'Itaú',
  'Banco AV Villas',
  'Banco Pichincha',
  'Banco GNB Sudameris',
  'Citibank',
  'Nequi',
  'Daviplata',
];

export function AdminPanel() {
  const { businessConfig, setBusinessConfig, paymentConfig, setPaymentConfig, products, sales } = usePOS();
  const [localBusinessConfig, setLocalBusinessConfig] = useState(businessConfig);
  const [localPaymentConfig, setLocalPaymentConfig] = useState(paymentConfig);

  const handleSaveBusinessConfig = () => {
    setBusinessConfig(localBusinessConfig);
    toast.success('✅ Configuración guardada');
  };

  const handleSavePaymentConfig = () => {
    setPaymentConfig(localPaymentConfig);
    toast.success('✅ Métodos de pago actualizados');
  };

  // Calculate stats
  const todaySales = sales.filter(s => {
    const saleDate = new Date(s.date).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  });
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert && p.active);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          ⚙️ Panel de Administración
        </h2>
      </div>
      
      <Tabs defaultValue="stats" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 grid grid-cols-4 h-12">
          <TabsTrigger value="stats" className="text-xs sm:text-sm">📊 Estadísticas</TabsTrigger>
          <TabsTrigger value="business" className="text-xs sm:text-sm">🏪 Negocio</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">💳 Pagos</TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm">📦 Stock</TabsTrigger>
        </TabsList>
        
        {/* Stats Tab */}
        <TabsContent value="stats" className="flex-1 p-4 overflow-y-auto">
          <StatsPanel />
        </TabsContent>
        
        {/* Business Tab */}
        <TabsContent value="business" className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input
                id="businessName"
                value={localBusinessConfig.businessName}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Mi Tienda"
              />
            </div>
            
            <div>
              <Label htmlFor="businessSlogan">Slogan</Label>
              <Input
                id="businessSlogan"
                value={localBusinessConfig.businessSlogan}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, businessSlogan: e.target.value }))}
                placeholder="Tu tienda de confianza"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp del Negocio</Label>
              <Input
                id="whatsappNumber"
                value={localBusinessConfig.whatsappNumber}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="300 123 4567"
              />
              <p className="text-xs text-muted-foreground mt-1">Se usará para enlaces de WhatsApp</p>
            </div>
            
            <div>
              <Label htmlFor="businessPhone">Teléfono Fijo (opcional)</Label>
              <Input
                id="businessPhone"
                value={localBusinessConfig.businessPhone}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, businessPhone: e.target.value }))}
                placeholder="601 123 4567"
              />
            </div>
            
            <div>
              <Label htmlFor="businessAddress">Dirección</Label>
              <Input
                id="businessAddress"
                value={localBusinessConfig.businessAddress}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Calle 45 #12-34"
              />
            </div>
            
            <div>
              <Label htmlFor="businessNit">NIT (opcional)</Label>
              <Input
                id="businessNit"
                value={localBusinessConfig.businessNit}
                onChange={(e) => setLocalBusinessConfig(prev => ({ ...prev, businessNit: e.target.value }))}
                placeholder="123456789-0"
              />
            </div>
            
            <Button onClick={handleSaveBusinessConfig} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments" className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Nequi */}
          <div className="card-elevated p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💚</span>
                <span className="font-bold">Nequi</span>
              </div>
              <Switch
                checked={localPaymentConfig.nequiEnabled}
                onCheckedChange={(checked) => setLocalPaymentConfig(prev => ({ ...prev, nequiEnabled: checked }))}
              />
            </div>
            {localPaymentConfig.nequiEnabled && (
              <div className="space-y-3">
                <div>
                  <Label>Número Nequi</Label>
                  <Input
                    value={localPaymentConfig.nequiNumber}
                    onChange={(e) => setLocalPaymentConfig(prev => ({ ...prev, nequiNumber: e.target.value }))}
                    placeholder="300 123 4567"
                  />
                </div>
                <div>
                  <Label>Nombre del Titular</Label>
                  <Input
                    value={localPaymentConfig.nequiHolder}
                    onChange={(e) => setLocalPaymentConfig(prev => ({ ...prev, nequiHolder: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Transferencia */}
          <div className="card-elevated p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                <span className="font-bold">Transferencia</span>
              </div>
              <Switch
                checked={localPaymentConfig.transferenciaEnabled}
                onCheckedChange={(checked) => setLocalPaymentConfig(prev => ({ ...prev, transferenciaEnabled: checked }))}
              />
            </div>
            {localPaymentConfig.transferenciaEnabled && (
              <div className="space-y-3">
                <div>
                  <Label>Banco</Label>
                  <Select
                    value={localPaymentConfig.bankName}
                    onValueChange={(value) => setLocalPaymentConfig(prev => ({ ...prev, bankName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOMBIAN_BANKS.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Número de Cuenta</Label>
                  <Input
                    value={localPaymentConfig.bankAccount}
                    onChange={(e) => setLocalPaymentConfig(prev => ({ ...prev, bankAccount: e.target.value }))}
                    placeholder="12345678901"
                  />
                </div>
                <div>
                  <Label>Tipo de Cuenta</Label>
                  <Select
                    value={localPaymentConfig.bankAccountType}
                    onValueChange={(value: 'ahorros' | 'corriente') => setLocalPaymentConfig(prev => ({ ...prev, bankAccountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahorros">Ahorros</SelectItem>
                      <SelectItem value="corriente">Corriente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nombre del Titular</Label>
                  <Input
                    value={localPaymentConfig.bankHolder}
                    onChange={(e) => setLocalPaymentConfig(prev => ({ ...prev, bankHolder: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Efectivo */}
          <div className="card-elevated p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💵</span>
                <span className="font-bold">Efectivo</span>
              </div>
              <Switch
                checked={localPaymentConfig.efectivoEnabled}
                onCheckedChange={(checked) => setLocalPaymentConfig(prev => ({ ...prev, efectivoEnabled: checked }))}
              />
            </div>
            {localPaymentConfig.efectivoEnabled && (
              <div>
                <Label>Mensaje para el cliente</Label>
                <Input
                  value={localPaymentConfig.efectivoMessage}
                  onChange={(e) => setLocalPaymentConfig(prev => ({ ...prev, efectivoMessage: e.target.value }))}
                  placeholder="Trae el valor exacto por favor"
                />
              </div>
            )}
          </div>
          
          <Button onClick={handleSavePaymentConfig} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Guardar Métodos de Pago
          </Button>
        </TabsContent>
        
        {/* Products/Stock Tab */}
        <TabsContent value="products" className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {products.map(product => (
              <div
                key={product.id}
                className="card-elevated p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{product.shortCode}</span> • {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${product.stock <= product.minStockAlert ? 'text-warning' : ''}`}>
                    {product.stock}
                  </p>
                  <p className="text-xs text-muted-foreground">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
