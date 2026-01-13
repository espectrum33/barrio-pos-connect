export interface Product {
  id: string;
  code: string;
  shortCode: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  emoji: string;
  image?: string;
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
  // Comidas
  { id: '1', code: 'P001', shortCode: 'HB', name: 'Hamburguesa Clásica', price: 15000, stock: 50, category: 'comida', emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '2', code: 'P002', shortCode: 'PZ', name: 'Pizza Personal', price: 18000, stock: 30, category: 'comida', emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '3', code: 'P003', shortCode: 'HD', name: 'Hot Dog', price: 10000, stock: 40, category: 'comida', emoji: '🌭', image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '4', code: 'P004', shortCode: 'TC', name: 'Tacos x3', price: 16000, stock: 35, category: 'comida', emoji: '🌮', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '5', code: 'P005', shortCode: 'PF', name: 'Papas Fritas', price: 8000, stock: 60, category: 'comida', emoji: '🍟', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '6', code: 'P006', shortCode: 'AL', name: 'Alitas x6', price: 20000, stock: 25, category: 'comida', emoji: '🍗', image: 'https://images.unsplash.com/photo-1608039829572-9b0099dafe6e?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '7', code: 'P007', shortCode: 'EM', name: 'Empanada', price: 3000, stock: 80, category: 'comida', emoji: '🥟', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '8', code: 'P008', shortCode: 'AR', name: 'Arepa Rellena', price: 7000, stock: 45, category: 'comida', emoji: '🫓', image: 'https://images.unsplash.com/photo-1599119723098-63d2f3e91e47?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '9', code: 'P009', shortCode: 'BU', name: 'Burrito', price: 14000, stock: 30, category: 'comida', emoji: '🌯', image: 'https://images.unsplash.com/photo-1626700051175-6ac293e13cb3?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '10', code: 'P010', shortCode: 'SD', name: 'Sandwich Club', price: 12000, stock: 35, category: 'comida', emoji: '🥪', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '11', code: 'P011', shortCode: 'NS', name: 'Nuggets x6', price: 9000, stock: 40, category: 'comida', emoji: '🍗', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '12', code: 'P012', shortCode: 'SL', name: 'Salchipapa', price: 11000, stock: 50, category: 'comida', emoji: '🍟', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },

  // Bebidas
  { id: '13', code: 'P013', shortCode: 'GS', name: 'Gaseosa 500ml', price: 3500, stock: 100, category: 'bebidas', emoji: '🥤', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '14', code: 'P014', shortCode: 'AG', name: 'Agua Botella', price: 2000, stock: 120, category: 'bebidas', emoji: '💧', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '15', code: 'P015', shortCode: 'JN', name: 'Jugo Natural', price: 5000, stock: 40, category: 'bebidas', emoji: '🧃', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '16', code: 'P016', shortCode: 'CF', name: 'Café Americano', price: 4000, stock: 50, category: 'bebidas', emoji: '☕', image: 'https://images.unsplash.com/photo-1497515114889-3f74a2c7e8f9?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '17', code: 'P017', shortCode: 'CV', name: 'Cerveza', price: 5000, stock: 80, category: 'bebidas', emoji: '🍺', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '18', code: 'P018', shortCode: 'GL', name: 'Gaseosa Litro', price: 5500, stock: 60, category: 'bebidas', emoji: '🥤', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '19', code: 'P019', shortCode: 'LM', name: 'Limonada', price: 4500, stock: 40, category: 'bebidas', emoji: '🍋', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '20', code: 'P020', shortCode: 'MT', name: 'Malta', price: 3000, stock: 50, category: 'bebidas', emoji: '🍺', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },

  // Lácteos
  { id: '21', code: 'P021', shortCode: 'LC', name: 'Leche 1L', price: 4500, stock: 80, category: 'lacteos', emoji: '🥛', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '22', code: 'P022', shortCode: 'QS', name: 'Queso 500g', price: 12000, stock: 40, category: 'lacteos', emoji: '🧀', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '23', code: 'P023', shortCode: 'YG', name: 'Yogurt', price: 3800, stock: 60, category: 'lacteos', emoji: '🥛', image: 'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '24', code: 'P024', shortCode: 'HV', name: 'Huevos Docena', price: 8500, stock: 70, category: 'lacteos', emoji: '🥚', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '25', code: 'P025', shortCode: 'MQ', name: 'Mantequilla', price: 6000, stock: 45, category: 'lacteos', emoji: '🧈', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '26', code: 'P026', shortCode: 'CR', name: 'Crema de Leche', price: 5500, stock: 35, category: 'lacteos', emoji: '🥛', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },

  // Panadería
  { id: '27', code: 'P027', shortCode: 'PN', name: 'Pan Tajado', price: 3500, stock: 50, category: 'panaderia', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '28', code: 'P028', shortCode: 'PB', name: 'Pan Baguette', price: 4000, stock: 30, category: 'panaderia', emoji: '🥖', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '29', code: 'P029', shortCode: 'CU', name: 'Croissant', price: 2000, stock: 40, category: 'panaderia', emoji: '🥐', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '30', code: 'P030', shortCode: 'DO', name: 'Dona', price: 2500, stock: 35, category: 'panaderia', emoji: '🍩', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '31', code: 'P031', shortCode: 'PS', name: 'Pastel', price: 3500, stock: 25, category: 'panaderia', emoji: '🥧', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '32', code: 'P032', shortCode: 'MF', name: 'Muffin', price: 3000, stock: 30, category: 'panaderia', emoji: '🧁', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },

  // Snacks
  { id: '33', code: 'P033', shortCode: 'GA', name: 'Galletas', price: 2500, stock: 90, category: 'snacks', emoji: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '34', code: 'P034', shortCode: 'PP', name: 'Papas Paquete', price: 3500, stock: 80, category: 'snacks', emoji: '🍿', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '35', code: 'P035', shortCode: 'CH', name: 'Chocolatina', price: 1500, stock: 100, category: 'snacks', emoji: '🍫', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 30 },
  { id: '36', code: 'P036', shortCode: 'DC', name: 'Dulces', price: 500, stock: 150, category: 'snacks', emoji: '🍬', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 50 },
  { id: '37', code: 'P037', shortCode: 'MN', name: 'Maní', price: 2000, stock: 70, category: 'snacks', emoji: '🥜', image: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '38', code: 'P038', shortCode: 'PL', name: 'Paleta', price: 1000, stock: 80, category: 'snacks', emoji: '🍭', image: 'https://images.unsplash.com/photo-1601379329542-31c59347e2b3?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 25 },

  // Granos
  { id: '39', code: 'P039', shortCode: 'AZ', name: 'Arroz 1kg', price: 3200, stock: 60, category: 'granos', emoji: '🍚', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '40', code: 'P040', shortCode: 'FR', name: 'Frijol 500g', price: 4000, stock: 50, category: 'granos', emoji: '🫘', image: 'https://images.unsplash.com/photo-1551462147-ff73b9bc4837?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '41', code: 'P041', shortCode: 'LN', name: 'Lenteja 500g', price: 4500, stock: 45, category: 'granos', emoji: '🫘', image: 'https://images.unsplash.com/photo-1544575785-a5dcf96f5c09?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '42', code: 'P042', shortCode: 'AV', name: 'Avena 500g', price: 3500, stock: 40, category: 'granos', emoji: '🌾', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '43', code: 'P043', shortCode: 'AC', name: 'Azúcar 1kg', price: 3000, stock: 55, category: 'granos', emoji: '🍬', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '44', code: 'P044', shortCode: 'SL', name: 'Sal 500g', price: 1500, stock: 70, category: 'granos', emoji: '🧂', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },

  // Aseo
  { id: '45', code: 'P045', shortCode: 'JB', name: 'Jabón Baño', price: 3500, stock: 50, category: 'aseo', emoji: '🧼', image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '46', code: 'P046', shortCode: 'DT', name: 'Detergente', price: 8000, stock: 40, category: 'aseo', emoji: '🧴', image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '47', code: 'P047', shortCode: 'PH', name: 'Papel Higiénico', price: 6000, stock: 60, category: 'aseo', emoji: '🧻', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 15 },
  { id: '48', code: 'P048', shortCode: 'SV', name: 'Servilletas', price: 2500, stock: 70, category: 'aseo', emoji: '🧻', image: 'https://images.unsplash.com/photo-1585251951769-23c72b9ad0ec?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 20 },
  { id: '49', code: 'P049', shortCode: 'DS', name: 'Desinfectante', price: 7000, stock: 35, category: 'aseo', emoji: '🧹', image: 'https://images.unsplash.com/photo-1584827387292-5e23bbb6c4f2?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
  { id: '50', code: 'P050', shortCode: 'CP', name: 'Cepillo Dental', price: 4000, stock: 45, category: 'aseo', emoji: '🪥', image: 'https://images.unsplash.com/photo-1559617203-a40c7ae04819?w=400&h=400&fit=crop', active: true, timesSold: 0, minStockAlert: 10 },
];
