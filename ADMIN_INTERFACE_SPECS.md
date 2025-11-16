# 🔐 ADMIN INTERFACE - ROADMAP & SPECIFICATIONS

## 📋 Vue d'ensemble

Interface d'administration pour gérer les produits, commandes, et utilisateurs de l'e-commerce store.

**Status** : 🟡 Optionnel (Futur Enhancement)  
**Priorité** : Basse  
**Estimé** : 2-3 semaines  
**Complexité** : Moyenne-Haute

---

## 🎯 Objectifs

### Fonctionnalités Core
1. **Dashboard** : Vue d'ensemble des métriques
2. **Gestion Produits** : CRUD complet
3. **Gestion Commandes** : Suivi et status
4. **Gestion Utilisateurs** : Liste et rôles
5. **Analytics** : Statistiques ventes

---

## 🏗️ Architecture Proposée

### Stack Technique

```typescript
{
  // Frontend (même base que store)
  "react": "18.2.0",
  "typescript": "5.2.2",
  "redux-toolkit": "2.0.1",
  
  // UI Library (pour rapidité)
  "shadcn/ui": "latest",        // Component library
  "recharts": "2.10.0",         // Charts & graphs
  "react-table": "8.0.0",       // Data tables
  
  // Backend (nouveau)
  "express": "4.18.2",
  "mongodb": "6.0.0",           // Database
  "mongoose": "8.0.0",          // ODM
  "jsonwebtoken": "9.0.0",      // Auth
  "bcrypt": "5.1.0"             // Password hashing
}
```

### Routes Frontend

```
/admin/
├── /dashboard          # Vue d'ensemble
├── /products           # Liste produits
│   ├── /new           # Ajouter produit
│   └── /:id/edit      # Modifier produit
├── /orders            # Liste commandes
│   └── /:id           # Détail commande
├── /users             # Liste utilisateurs
│   └── /:id           # Détail utilisateur
└── /analytics         # Statistiques
```

---

## 📊 FEATURES DÉTAILLÉES

### 1. Dashboard 📈

**Métriques affichées :**
```typescript
interface DashboardMetrics {
  totalSales: number;          // Ventes totales (€)
  totalOrders: number;         // Nombre de commandes
  totalProducts: number;       // Produits en stock
  totalUsers: number;          // Utilisateurs inscrits
  recentOrders: Order[];       // 5 dernières commandes
  topProducts: Product[];      // Top 5 produits
  salesChart: ChartData;       // Graphique ventes (7j)
}
```

**UI Components :**
- 4 Cards avec KPIs (sales, orders, products, users)
- Line chart (ventes 7 derniers jours)
- Table des dernières commandes
- Liste top produits

**Code Example :**
```typescript
// components/admin/Dashboard.tsx
export const Dashboard: React.FC = () => {
  const { data: metrics } = useGetDashboardMetricsQuery();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard 
        title="Total Sales" 
        value={`€${metrics.totalSales}`}
        icon={<DollarSign />}
      />
      <MetricCard 
        title="Orders" 
        value={metrics.totalOrders}
        icon={<ShoppingCart />}
      />
      {/* ... */}
      
      <div className="col-span-4">
        <SalesChart data={metrics.salesChart} />
      </div>
      
      <div className="col-span-2">
        <RecentOrdersTable orders={metrics.recentOrders} />
      </div>
    </div>
  );
};
```

---

### 2. Gestion Produits 🛍️

**CRUD Complet :**
- ✅ Create : Ajouter nouveau produit
- ✅ Read : Lister tous les produits
- ✅ Update : Modifier produit existant
- ✅ Delete : Supprimer produit

**Form Fields :**
```typescript
interface ProductForm {
  name: string;              // Required
  description: string;       // Required
  price: number;            // Required, > 0
  category: Category;       // Required
  stock: number;            // Required, >= 0
  image: File | string;     // Required
  isActive: boolean;        // Default: true
  isFeatured: boolean;      // Default: false
  tags: string[];           // Optional
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
```

**UI Features :**
- Search & filter products
- Sort by name, price, stock
- Bulk actions (delete multiple)
- Image upload with preview
- Rich text editor for description

**Code Example :**
```typescript
// pages/admin/ProductsPage.tsx
export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: products } = useGetProductsQuery({ search });
  
  return (
    <div>
      <div className="flex justify-between mb-6">
        <Input 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="mr-2" /> Add Product
        </Button>
      </div>
      
      <DataTable 
        columns={productColumns}
        data={products}
        actions={[
          { label: 'Edit', action: handleEdit },
          { label: 'Delete', action: handleDelete }
        ]}
      />
    </div>
  );
};
```

---

### 3. Gestion Commandes 📦

**Status Workflow :**
```typescript
enum OrderStatus {
  PENDING = 'pending',       // Nouvelle commande
  CONFIRMED = 'confirmed',   // Confirmée
  PROCESSING = 'processing', // En préparation
  SHIPPED = 'shipped',       // Expédiée
  DELIVERED = 'delivered',   // Livrée
  CANCELLED = 'cancelled'    // Annulée
}
```

**Order Details :**
```typescript
interface Order {
  id: string;
  orderNumber: string;        // #ORD-12345
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}
```

**UI Features :**
- Filter by status
- Search by order number or customer
- Update order status
- Print invoice
- Send email notification

**Code Example :**
```typescript
// pages/admin/OrderDetailPage.tsx
export const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const { data: order } = useGetOrderQuery(id);
  const [updateStatus] = useUpdateOrderStatusMutation();
  
  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateStatus({ id, status: newStatus });
    // Send email notification
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Order #{order.orderNumber}</h1>
        <Select 
          value={order.status}
          onChange={handleStatusChange}
          options={Object.values(OrderStatus)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <Card title="Customer Info">
          <p>{order.customer.name}</p>
          <p>{order.customer.email}</p>
        </Card>
        
        <Card title="Shipping Address">
          <Address data={order.shippingAddress} />
        </Card>
      </div>
      
      <OrderItemsTable items={order.items} />
      
      <OrderSummary 
        subtotal={order.subtotal}
        shipping={order.shipping}
        tax={order.tax}
        total={order.total}
      />
    </div>
  );
};
```

---

### 4. Gestion Utilisateurs 👥

**User Roles :**
```typescript
enum UserRole {
  CUSTOMER = 'customer',     // Client normal
  ADMIN = 'admin',           // Administrateur
  SUPER_ADMIN = 'super_admin' // Super admin
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date;
  orders: Order[];          // Historique commandes
}
```

**UI Features :**
- List all users
- Search by name/email
- Filter by role
- Change user role (admin only)
- Deactivate/activate user
- View order history

---

### 5. Analytics 📊

**Metrics à tracker :**
```typescript
interface Analytics {
  sales: {
    daily: ChartData;       // Ventes par jour (30j)
    monthly: ChartData;     // Ventes par mois (12 mois)
    byCategory: PieData;    // Ventes par catégorie
  };
  customers: {
    newCustomers: number;   // Nouveaux clients (30j)
    returningRate: number;  // Taux de retour (%)
    avgOrderValue: number;  // Panier moyen
  };
  products: {
    topSelling: Product[];  // Top 10 produits
    lowStock: Product[];    // Stock bas (< 10)
    outOfStock: Product[];  // Rupture de stock
  };
}
```

**Charts à afficher :**
- Line chart : Évolution des ventes (30j)
- Bar chart : Ventes par catégorie
- Pie chart : Distribution des commandes par status
- Table : Top 10 produits

---

## 🔐 AUTHENTICATION & SECURITY

### JWT Authentication

**Flow :**
```typescript
// 1. Login
POST /api/admin/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "admin@example.com",
    "role": "admin"
  }
}

// 2. Protected Routes
GET /api/admin/products
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Middleware Example :**
```typescript
// middleware/auth.ts
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

---

## 🗄️ DATABASE SCHEMA (MongoDB)

### Products Collection
```typescript
const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, { timestamps: true });
```

### Orders Collection
```typescript
const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });
```

### Users Collection
```typescript
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'super_admin'],
    default: 'customer'
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });
```

---

## 🚀 ROADMAP D'IMPLÉMENTATION

### Phase 1 : Backend Setup (1 semaine)
- [ ] Setup Express server
- [ ] Connect MongoDB
- [ ] Create database schemas
- [ ] Implement JWT authentication
- [ ] Create API endpoints (CRUD)
- [ ] Add middleware (auth, validation)
- [ ] Write backend tests

### Phase 2 : Frontend Core (1 semaine)
- [ ] Create admin routes structure
- [ ] Build Dashboard page
- [ ] Build Products CRUD pages
- [ ] Build Orders list & detail pages
- [ ] Implement authentication flow
- [ ] Add protected routes

### Phase 3 : Advanced Features (1 semaine)
- [ ] Build Users management page
- [ ] Build Analytics page
- [ ] Add charts & graphs (Recharts)
- [ ] Implement image upload
- [ ] Add notifications system
- [ ] Write frontend tests

---

## 🧪 TESTING STRATEGY

### Backend Tests (Jest)
```typescript
describe('Products API', () => {
  it('should create a new product', async () => {
    const response = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(mockProduct);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(mockProduct.name);
  });
  
  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/admin/products')
      .send(mockProduct);
    
    expect(response.status).toBe(401);
  });
});
```

### Frontend Tests (Vitest + RTL)
```typescript
describe('ProductForm', () => {
  it('should validate required fields', async () => {
    render(<ProductForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Price is required')).toBeInTheDocument();
  });
});
```

---

## 💰 COÛT ESTIMÉ (Si freelance)

### Temps de développement
- Backend : 40 heures
- Frontend : 40 heures
- Tests : 20 heures
- **Total : 100 heures**

### À tarif freelance (50€/h)
- **Total : 5 000€**

---

## 🎯 PRIORITÉS SI IMPLÉMENTATION

### Must-Have (MVP)
1. ✅ Dashboard basique
2. ✅ Products CRUD
3. ✅ Orders list + status update
4. ✅ Authentication

### Should-Have
5. ⭐ Users management
6. ⭐ Analytics basiques
7. ⭐ Search & filters

### Nice-to-Have
8. 💡 Advanced analytics
9. 💡 Bulk operations
10. 💡 Export data (CSV, PDF)
11. 💡 Email notifications
12. 💡 Real-time updates (WebSocket)

---

## 📚 RESSOURCES UTILES

### Libraries
- **shadcn/ui** : https://ui.shadcn.com/ (UI components)
- **Recharts** : https://recharts.org/ (Charts)
- **React Table** : https://tanstack.com/table (Data tables)
- **React Hook Form** : https://react-hook-form.com/ (Forms)

### Tutorials
- JWT Auth : https://jwt.io/introduction
- MongoDB Node.js : https://www.mongodb.com/docs/drivers/node/
- Express Best Practices : https://expressjs.com/en/advanced/best-practice-security.html

---

## ✅ DECISION CHECKLIST

Implémenter Admin Interface si :
- [ ] Vous avez besoin de gérer > 50 produits
- [ ] Vous voulez un vrai backend (pas juste mock data)
- [ ] Vous visez un poste Full-Stack
- [ ] Vous avez 2-3 semaines disponibles
- [ ] Vous voulez apprendre MongoDB/Express

**Sinon** : Gardez le focus sur le frontend et passez à d'autres projets.

---

**Date** : 30 Octobre 2025  
**Status** : 📋 Spécifications complètes - Prêt à implémenter  
**Priorité** : 🟡 Basse (optionnel)  
**Effort** : 🔴 Élevé (100 heures)
