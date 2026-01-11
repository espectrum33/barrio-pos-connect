import { useState } from 'react';
import { MessageCircle, Copy, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePOS } from '@/context/POSContext';
import { parseWhatsAppOrder, formatCurrency, copyToClipboard, generateWhatsAppCatalog } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES } from '@/types/pos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function WhatsAppPanel() {
  const { products, addToCart, businessConfig } = usePOS();
  const [orderText, setOrderText] = useState('');
  const [parsedItems, setParsedItems] = useState<ReturnType<typeof parseWhatsAppOrder>>([]);
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [includeStock, setIncludeStock] = useState(true);

  const handleParseOrder = () => {
    if (!orderText.trim()) {
      toast.error('Pega el mensaje del cliente');
      return;
    }
    
    const parsed = parseWhatsAppOrder(orderText, products);
    setParsedItems(parsed);
    
    if (parsed.length === 0) {
      toast.error('🔍 No se encontraron productos en el mensaje');
    } else {
      const found = parsed.filter(p => p.found).length;
      const notFound = parsed.filter(p => !p.found).length;
      if (notFound > 0) {
        toast.warning(`⚠️ ${notFound} productos no encontrados`);
      } else {
        toast.success(`✅ ${found} productos identificados`);
      }
    }
  };

  const handleAddParsedToCart = () => {
    const validItems = parsedItems.filter(p => p.found);
    validItems.forEach(item => {
      const product = products.find(p => p.shortCode.toUpperCase() === item.shortCode);
      if (product) {
        for (let i = 0; i < item.quantity; i++) {
          addToCart(product);
        }
      }
    });
    setOrderText('');
    setParsedItems([]);
    toast.success('✅ Productos agregados al carrito');
  };

  const handleCopyCatalog = async () => {
    const catalog = generateWhatsAppCatalog(
      products,
      businessConfig.businessName,
      catalogCategory,
      includeStock
    );
    const success = await copyToClipboard(catalog);
    if (success) {
      toast.success('📋 Catálogo copiado');
    } else {
      toast.error('Error al copiar');
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border bg-whatsapp/10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-whatsapp" />
          WhatsApp
        </h2>
      </div>
      
      <Tabs defaultValue="order" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-2">
          <TabsTrigger value="order">📝 Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="catalog">📋 Catálogo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="order" className="flex-1 p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Pega el mensaje del cliente:
            </label>
            <Textarea
              placeholder="Ej: Hola quiero HB x2, GS x1"
              value={orderText}
              onChange={(e) => setOrderText(e.target.value)}
              className="h-24 resize-none"
            />
          </div>
          
          <Button 
            onClick={handleParseOrder}
            className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            Interpretar Pedido
          </Button>
          
          {/* Parsed results */}
          {parsedItems.length > 0 && (
            <div className="space-y-3 animate-slide-up">
              <h3 className="font-semibold text-sm">Productos detectados:</h3>
              <div className="space-y-2">
                {parsedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg flex items-center justify-between",
                      item.found ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.found ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      <span className="font-mono font-bold">{item.shortCode}</span>
                      <span className="text-sm">
                        {item.found ? item.productName : 'No encontrado'}
                      </span>
                    </div>
                    <span className="font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              
              {parsedItems.some(p => p.found) && (
                <Button
                  onClick={handleAddParsedToCart}
                  className="w-full"
                >
                  ✅ Agregar al Carrito
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="catalog" className="flex-1 p-4 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Categoría:</label>
              <Select value={catalogCategory} onValueChange={setCatalogCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeStock}
                onChange={(e) => setIncludeStock(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm">Incluir cantidad en stock</span>
            </label>
          </div>
          
          <Button
            onClick={handleCopyCatalog}
            className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Catálogo
          </Button>
          
          {/* Preview */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2">Vista previa:</h3>
            <div className="bg-muted p-3 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
              {generateWhatsAppCatalog(
                products,
                businessConfig.businessName,
                catalogCategory,
                includeStock
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
