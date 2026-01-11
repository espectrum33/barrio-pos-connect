export interface Product {
  id: string;
  code: string;
  shortCode: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  emoji: string;
  active: boolean;
  timesSold: number;
  minStockAlert: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  favoriteProducts: string[];
  lastOrderDate: string;
}

export interface Order {
  id: string;
  code: string;
  source: 'whatsapp' | 'presencial' | 'web';
  status: 'new' | 'pending' | 'paid' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  customerPhone: string;
  customerName: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  payment: PaymentMethod;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  notes: string;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

export interface Sale {
  id: string;
  code: string;
  items: CartItem[];
  total: number;
  payment: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  date: string;
}

export type PaymentMethod = 'efectivo' | 'nequi' | 'transferencia' | 'daviplata';

export interface PaymentConfig {
  nequiEnabled: boolean;
  nequiNumber: string;
  nequiHolder: string;
  
  transferenciaEnabled: boolean;
  bankName: string;
  bankAccount: string;
  bankAccountType: 'ahorros' | 'corriente';
  bankHolder: string;
  
  efectivoEnabled: boolean;
  efectivoMessage: string;
  
  daviplataEnabled: boolean;
  daviplataNumber: string;
  daviplataHolder: string;
}

export interface BusinessConfig {
  businessName: string;
  businessSlogan: string;
  businessPhone: string;
  businessAddress: string;
  businessNit: string;
  whatsappNumber: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todo', emoji: '🏪' },
  { id: 'comida', name: 'Comidas', emoji: '🍔' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
  { id: 'lacteos', name: 'Lácteos', emoji: '🥛' },
  { id: 'panaderia', name: 'Panadería', emoji: '🍞' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'granos', name: 'Granos', emoji: '🍚' },
  { id: 'aseo', name: 'Aseo', emoji: '🧹' },
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', code: 'P001', shortCode: 'HB', name: 'Hamburguesa Clásica', price: 15000, stock: 50, category: 'comida', emoji: '🍔', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '2', code: 'P002', shortCode: 'PZ', name: 'Pizza Personal', price: 18000, stock: 30, category: 'comida', emoji: '🍕', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '3', code: 'P003', shortCode: 'HD', name: 'Hot Dog', price: 10000, stock: 40, category: 'comida', emoji: '🌭', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '4', code: 'P004', shortCode: 'TC', name: 'Tacos x3', price: 16000, stock: 35, category: 'comida', emoji: '🌮', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '5', code: 'P005', shortCode: 'PF', name: 'Papas Fritas', price: 8000, stock: 60, category: 'comida', emoji: '🍟', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '6', code: 'P006', shortCode: 'AL', name: 'Alitas x6', price: 20000, stock: 25, category: 'comida', emoji: '🍗', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '7', code: 'P007', shortCode: 'GS', name: 'Gaseosa 500ml', price: 3500, stock: 100, category: 'bebidas', emoji: '🥤', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '8', code: 'P008', shortCode: 'AG', name: 'Agua Botella', price: 2000, stock: 120, category: 'bebidas', emoji: '💧', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '9', code: 'P009', shortCode: 'JN', name: 'Jugo Natural', price: 5000, stock: 40, category: 'bebidas', emoji: '🧃', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '10', code: 'P010', shortCode: 'CF', name: 'Café Americano', price: 4000, stock: 50, category: 'bebidas', emoji: '☕', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '11', code: 'P011', shortCode: 'LC', name: 'Leche 1L', price: 4500, stock: 80, category: 'lacteos', emoji: '🥛', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '12', code: 'P012', shortCode: 'QS', name: 'Queso 500g', price: 12000, stock: 40, category: 'lacteos', emoji: '🧀', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '13', code: 'P013', shortCode: 'YG', name: 'Yogurt', price: 3800, stock: 60, category: 'lacteos', emoji: '🥛', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '14', code: 'P014', shortCode: 'HV', name: 'Huevos Docena', price: 8500, stock: 70, category: 'lacteos', emoji: '🥚', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '15', code: 'P015', shortCode: 'PN', name: 'Pan Tajado', price: 3500, stock: 50, category: 'panaderia', emoji: '🍞', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '16', code: 'P016', shortCode: 'GL', name: 'Galletas', price: 2500, stock: 90, category: 'snacks', emoji: '🍪', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '17', code: 'P017', shortCode: 'PP', name: 'Papas Paquete', price: 3500, stock: 80, category: 'snacks', emoji: '🍿', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '18', code: 'P018', shortCode: 'CH', name: 'Chocolatina', price: 1500, stock: 100, category: 'snacks', emoji: '🍫', active: true, timesSold: 0, minStockAlert: 30 },
  { id: '19', code: 'P019', shortCode: 'AR', name: 'Arroz 1kg', price: 3200, stock: 60, category: 'granos', emoji: '🍚', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '20', code: 'P020', shortCode: 'FR', name: 'Frijol 500g', price: 4000, stock: 50, category: 'granos', emoji: '🫘', active: true, timesSold: 0, minStockAlert: 15 },
];
