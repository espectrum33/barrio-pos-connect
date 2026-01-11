import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  Product, 
  CartItem, 
  Order, 
  Sale, 
  Customer,
  PaymentConfig, 
  BusinessConfig,
  DEFAULT_PRODUCTS,
  PaymentMethod
} from '@/types/pos';
import { toast } from 'sonner';

interface POSContextType {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  updateProduct: (product: Product) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'code' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Sales
  sales: Sale[];
  createSale: (items: CartItem[], payment: PaymentMethod, customerName?: string, customerPhone?: string) => Sale;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  findCustomerByPhone: (phone: string) => Customer | undefined;
  
  // Config
  businessConfig: BusinessConfig;
  setBusinessConfig: (config: BusinessConfig) => void;
  paymentConfig: PaymentConfig;
  setPaymentConfig: (config: PaymentConfig) => void;
  
  // UI State
  currentView: 'cashier' | 'admin' | 'orders';
  setCurrentView: (view: 'cashier' | 'admin' | 'orders') => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const defaultBusinessConfig: BusinessConfig = {
  businessName: 'Mi Tienda',
  businessSlogan: 'Tu tienda de confianza',
  businessPhone: '',
  businessAddress: '',
  businessNit: '',
  whatsappNumber: '',
};

const defaultPaymentConfig: PaymentConfig = {
  nequiEnabled: true,
  nequiNumber: '',
  nequiHolder: '',
  transferenciaEnabled: true,
  bankName: 'Bancolombia',
  bankAccount: '',
  bankAccountType: 'ahorros',
  bankHolder: '',
  efectivoEnabled: true,
  efectivoMessage: 'Trae el valor exacto por favor',
  daviplataEnabled: false,
  daviplataNumber: '',
  daviplataHolder: '',
};

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('pos-products', DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useLocalStorage<Order[]>('pos-orders', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('pos-sales', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('pos-customers', []);
  const [businessConfig, setBusinessConfig] = useLocalStorage<BusinessConfig>('pos-business-config', defaultBusinessConfig);
  const [paymentConfig, setPaymentConfig] = useLocalStorage<PaymentConfig>('pos-payment-config', defaultPaymentConfig);
  const [currentView, setCurrentView] = useState<'cashier' | 'admin' | 'orders'>('cashier');
  const [cartOpen, setCartOpen] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('⚠️ Sin stock disponible');
          return prev;
        }
        toast.success(`✅ ${product.name} actualizado`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`✅ ${product.name} agregado`);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.info('Producto eliminado');
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const product = products.find(p => p.id === productId);
      if (product && quantity > product.stock) {
        toast.error('⚠️ Stock insuficiente');
        return prev;
      }
      return prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, [products, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, [setProducts]);

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'code' | 'createdAt'>): Order => {
    const order: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      code: 'PAY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    toast.success('✅ Pedido creado');
    return order;
  }, [setOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
    toast.success('✅ Estado actualizado');
  }, [setOrders]);

  const createSale = useCallback((items: CartItem[], payment: PaymentMethod, customerName?: string, customerPhone?: string): Sale => {
    const sale: Sale = {
      id: crypto.randomUUID(),
      code: 'SALE-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      payment,
      customerName,
      customerPhone,
      date: new Date().toISOString(),
    };
    setSales(prev => [sale, ...prev]);
    
    // Update product stock
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProduct({
          ...product,
          stock: Math.max(0, product.stock - item.quantity),
          timesSold: product.timesSold + item.quantity,
        });
      }
    });
    
    clearCart();
    toast.success('✅ Venta registrada');
    return sale;
  }, [setSales, products, updateProduct, clearCart]);

  const addCustomer = useCallback((customerData: Omit<Customer, 'id'>) => {
    const customer: Customer = {
      ...customerData,
      id: crypto.randomUUID(),
    };
    setCustomers(prev => [...prev, customer]);
  }, [setCustomers]);

  const findCustomerByPhone = useCallback((phone: string) => {
    return customers.find(c => c.phone === phone);
  }, [customers]);

  return (
    <POSContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        sales,
        createSale,
        customers,
        addCustomer,
        findCustomerByPhone,
        businessConfig,
        setBusinessConfig,
        paymentConfig,
        setPaymentConfig,
        currentView,
        setCurrentView,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
