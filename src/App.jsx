import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  ShoppingBag,
  Trash2,
  Plus,
  ArrowRight,
  Sun,
  Moon,
  Copy,
  Check,
  BookOpen,
  Smartphone,
  Star,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Essence Mascara Lash Princess',
    price: 9.99,
    category: 'beauty',
    rating: 4.94,
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png'
  },
  {
    id: 2,
    title: 'Eyeshadow Palette with Mirror',
    price: 19.99,
    category: 'beauty',
    rating: 4.85,
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png'
  },
  {
    id: 3,
    title: 'Powder Canister',
    price: 14.99,
    category: 'beauty',
    rating: 4.75,
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png'
  },
  {
    id: 4,
    title: 'Red Lipstick',
    price: 12.99,
    category: 'beauty',
    rating: 4.62,
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png'
  },
  {
    id: 5,
    title: 'Red Nail Polish',
    price: 8.99,
    category: 'beauty',
    rating: 4.91,
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png'
  },
  {
    id: 6,
    title: 'Calvin Klein CK One',
    price: 49.99,
    category: 'fragrances',
    rating: 4.85,
    thumbnail: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png'
  }
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [screen, setScreen] = useState('products'); // 'products' | 'cart'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('app'); // 'app' | 'manual'
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Fetch products from DummyJSON
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=24')
      .then((r) => r.json())
      .then((j) => {
        if (j && j.products && j.products.length > 0) {
          setProducts(j.products);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('DummyJSON network fallback:', err);
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  // Practical Step 5: Add to Cart
  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  // Practical Step 6: Remove from Cart by index
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Practical Step 7: Total calculation
  const total = Number(cart.reduce((sum, p) => sum + Number(p.price || 0), 0).toFixed(2));

  const handleCheckout = () => {
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {
      // ignore confetti errors in headless/unsupported environments
    }
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setScreen('products');
    }, 2800);
  };

  // Categories list
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const expoCode = `// Expo SDK 54 - Practical 5: Product List with Add to Cart
// File: app/index.tsx (or App.tsx)

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Essence Mascara Lash Princess',
    price: 9.99,
    category: 'beauty',
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
  },
  {
    id: 2,
    title: 'Eyeshadow Palette with Mirror',
    price: 19.99,
    category: 'beauty',
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png',
  },
  {
    id: 3,
    title: 'Powder Canister',
    price: 14.99,
    category: 'beauty',
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png',
  },
];

export default function CartApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [screen, setScreen] = useState<'products' | 'cart'>('products');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('https://dummyjson.com/products?limit=30');
      if (!response.ok) throw new Error(\`API error: \${response.status}\`);
      const data = await response.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err: any) {
      console.warn('DummyJSON fetch error:', err?.message || err);
      setProducts((current) => (current.length > 0 ? current : FALLBACK_PRODUCTS));
      setError('Unable to fetch latest catalog. Displaying offline products.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (item: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((p) => p.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) => {
      const target = prevCart.find((item) => item.id === productId);
      if (!target) return prevCart;
      if (target.quantity <= 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setCart([]) },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert(
      'Order Successful! 🎉',
      \`Thank you for your purchase of $\${totalPrice.toFixed(2)}. Your order is confirmed!\`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => {
            setCart([]);
            setScreen('products');
          },
        },
      ]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart App</Text>
        <Text style={styles.headerSubtitle}>Practical 5 • DummyJSON API</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.tabButton, screen === 'products' && styles.tabButtonActive]}
          onPress={() => setScreen('products')}
        >
          <Text style={[styles.tabButtonText, screen === 'products' && styles.tabButtonTextActive]}>
            Products ({products.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, screen === 'cart' && styles.tabButtonActive]}
          onPress={() => setScreen('cart')}
        >
          <View style={styles.cartTabContent}>
            <Text style={[styles.tabButtonText, screen === 'cart' && styles.tabButtonTextActive]}>
              Cart
            </Text>
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Error / Offline Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchProducts()} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Screen 1: Products */}
      {screen === 'products' ? (
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {loading && !refreshing ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Fetching products from DummyJSON...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} />
              }
              renderItem={({ item }) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <View style={styles.productCard}>
                    <Image source={{ uri: item.thumbnail }} style={styles.productImage} resizeMode="cover" />
                    <View style={styles.productInfo}>
                      <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.productPrice}>\${item.price.toFixed(2)}</Text>
                      {inCart && <Text style={styles.inCartIndicator}>In Cart: {inCart.quantity}</Text>}
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                      <Text style={styles.addButtonText}>{inCart ? '+ Add More' : 'Add to Cart'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      ) : (
        /* Screen 2: Shopping Cart */
        <View style={styles.contentContainer}>
          {cart.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyCartIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>Add items from the product catalog to get started.</Text>
              <TouchableOpacity style={styles.browseButton} onPress={() => setScreen('products')}>
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.cartCard}>
                    <Image source={{ uri: item.thumbnail }} style={styles.cartImage} resizeMode="cover" />
                    <View style={styles.cartInfo}>
                      <Text style={styles.cartTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.cartUnitPrice}>\${item.price.toFixed(2)} each</Text>
                      <Text style={styles.cartSubtotal}>Subtotal: \${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                    <View style={styles.cartActions}>
                      <View style={styles.quantityRow}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQuantity(item.id)}>
                          <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyNumber}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQuantity(item.id)}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Items:</Text>
                  <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Price:</Text>
                  <Text style={styles.totalValue}>\${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                    <Text style={styles.clearBtnText}>Clear Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutBtnText}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  nav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabButtonActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  tabButtonTextActive: { color: '#ffffff' },
  cartTabContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { backgroundColor: '#ef4444', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 12 },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: { color: '#dc2626', fontSize: 12, flex: 1, marginRight: 8 },
  retryBtn: { backgroundColor: '#dc2626', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  retryBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  contentContainer: { flex: 1, backgroundColor: '#f8fafc' },
  searchContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  listContent: { padding: 16, gap: 12 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 6, marginBottom: 16 },
  emptyCartIcon: { fontSize: 54 },
  browseButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  browseButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  productImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f1f5f9' },
  productInfo: { flex: 1 },
  productTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#059669', marginTop: 3 },
  inCartIndicator: { fontSize: 11, color: '#2563eb', fontWeight: '600', marginTop: 2 },
  addButton: { backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  addButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  cartImage: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#f1f5f9' },
  cartInfo: { flex: 1 },
  cartTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  cartUnitPrice: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cartSubtotal: { fontSize: 13, fontWeight: '700', color: '#059669', marginTop: 2 },
  cartActions: { alignItems: 'flex-end', gap: 6 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, overflow: 'hidden' },
  qtyBtn: { width: 28, height: 28, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#334155' },
  qtyNumber: { width: 28, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#0f172a' },
  removeBtn: { paddingVertical: 2, paddingHorizontal: 4 },
  removeBtnText: { fontSize: 12, color: '#dc2626', fontWeight: '500' },
  summaryBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 3,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#059669' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  clearBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  clearBtnText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  checkoutBtn: { flex: 2, paddingVertical: 12, borderRadius: 8, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(expoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cart-app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon-box">
            <ShoppingCart className="header-icon" />
          </div>
          <div>
            <h1 className="header-title">Shopping Cart App</h1>
            <p className="header-tagline">DummyJSON API & REST</p>
          </div>
        </div>

        <div className="header-right">
          <div className="tab-pill">
            <button
              type="button"
              className={`pill-btn ${activeTab === 'app' ? 'active' : ''}`}
              onClick={() => setActiveTab('app')}
            >
              <Smartphone size={15} />
              <span>Live App</span>
            </button>
            <button
              type="button"
              className={`pill-btn ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              <BookOpen size={15} />
              <span>Record Book</span>
            </button>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'app' ? (
          <div className="simulator-container">
            <div className="phone-card">
              {/* Phone Status Bar Decorator */}
              <div className="phone-notch-bar">
                <span className="notch-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="notch-pill"></div>
                <div className="notch-icons">
                  <span className="notch-signal">●●●</span>
                </div>
              </div>

              {/* Title Section */}
              <div className="cart-card-header">
                <h2 className="title-practical">Product Store</h2>
                <p className="subtitle-practical">DummyJSON Live Catalog & Cart</p>
              </div>

              {/* Navigation Screen Tabs */}
              <div className="screen-nav-bar">
                <button
                  type="button"
                  className={`screen-nav-btn ${screen === 'products' ? 'active' : ''}`}
                  onClick={() => setScreen('products')}
                >
                  <ShoppingBag size={17} />
                  <span>Products</span>
                </button>

                <button
                  type="button"
                  className={`screen-nav-btn ${screen === 'cart' ? 'active' : ''}`}
                  onClick={() => setScreen('cart')}
                >
                  <ShoppingCart size={17} />
                  <span>Cart</span>
                  {cart.length > 0 && <span className="cart-count-badge">{cart.length}</span>}
                </button>
              </div>

              {/* Products View */}
              {screen === 'products' ? (
                <div className="products-container">
                  {/* Search Bar */}
                  <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search catalog..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Category Pills */}
                  {categories.length > 2 && (
                    <div className="category-scroll">
                      {categories.slice(0, 6).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products List */}
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Loading products from DummyJSON...</p>
                    </div>
                  ) : (
                    <div className="product-list-scroll">
                      {filteredProducts.map((item) => (
                        <div key={item.id} className="product-card">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="product-thumb"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/70x70?text=Product';
                            }}
                          />
                          <div className="product-info">
                            <h4 className="product-title">{item.title}</h4>
                            <div className="product-meta">
                              <span className="product-price">${item.price}</span>
                              {item.rating && (
                                <span className="product-rating">
                                  <Star size={12} className="star-icon" /> {item.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-add-cart"
                            onClick={() => addToCart(item)}
                            title="Add to Cart"
                          >
                            <Plus size={15} />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Cart View */
                <div className="cart-container">
                  {orderPlaced ? (
                    <div className="order-success-card">
                      <CheckCircle2 size={52} className="success-icon" />
                      <h3>Order Simulated!</h3>
                      <p>Thank you for testing Practical 5 shopping cart.</p>
                      <span className="order-total-pill">Total Paid: ${total}</span>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="empty-cart-card">
                      <ShoppingCart size={46} className="empty-cart-icon" />
                      <h3>Your cart is empty</h3>
                      <p>Browse products and tap "Add" to start shopping.</p>
                      <button
                        type="button"
                        className="btn-shop-now"
                        onClick={() => setScreen('products')}
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="cart-active-view">
                      <div className="cart-items-scroll">
                        {cart.map((item, index) => (
                          <div key={index} className="cart-item-card">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="cart-thumb"
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/50x50?text=Item';
                              }}
                            />
                            <div className="cart-item-details">
                              <h4 className="cart-item-title">{item.title}</h4>
                              <span className="cart-item-price">${item.price}</span>
                            </div>
                            <button
                              type="button"
                              className="btn-remove-item"
                              onClick={() => removeFromCart(index)}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Grand Total & Checkout Bar */}
                      <div className="cart-summary-card">
                        <div className="summary-row">
                          <span className="summary-label">Items Count:</span>
                          <span className="summary-val">{cart.length} item(s)</span>
                        </div>
                        <div className="summary-row total-row">
                          <span className="total-label">Grand Total:</span>
                          <span className="total-val">${total}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-checkout"
                          onClick={handleCheckout}
                        >
                          <Sparkles size={16} />
                          <span>Simulate Checkout</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="record-container">
            <div className="record-card">
              <div className="record-header">
                <div>
                  <span className="badge-practical">Lab Record</span>
                  <h2>Practical 5: Shopping Cart App</h2>
                </div>
                <button type="button" className="copy-btn" onClick={copyCode}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied Code!' : 'Copy React Native Code'}</span>
                </button>
              </div>

              <div className="record-section">
                <h3>📌 Aim</h3>
                <p>
                  To fetch a product list from the DummyJSON API, add products to a cart, remove them, and show the total price.
                </p>
              </div>

              <div className="record-section">
                <h3>⚙️ Prerequisites & CLI Steps</h3>
                <pre className="code-block">
{`npx create-expo-app@latest CartApp --template default@sdk-54
cd CartApp
npx expo start`}
                </pre>
              </div>

              <div className="record-section">
                <h3>📝 Algorithm (10 Steps)</h3>
                <ol className="algo-list">
                  <li>Import <code>useState, useEffect</code> from <code>"react"</code>, and <code>View, Text, Button, FlatList, Image</code> from <code>"react-native"</code>.</li>
                  <li>Create component: <code>export default function Index()</code></li>
                  <li>Create state variables: <code>products</code> ([]), <code>cart</code> ([]), and <code>screen</code> ("products").</li>
                  <li>Fetch products once when app starts: <code>fetch("https://dummyjson.com/products").then(r =&gt; r.json()).then(j =&gt; setProducts(j.products))</code>.</li>
                  <li>ADD TO CART: <code>const addToCart = (item) =&gt; setCart([...cart, item]);</code></li>
                  <li>REMOVE: <code>const removeFromCart = (index) =&gt; setCart(cart.filter((_, i) =&gt; i !== index));</code></li>
                  <li>TOTAL: <code>const total = cart.reduce((sum, p) =&gt; sum + p.price, 0);</code></li>
                  <li>In return, display two navigation buttons to switch screens: "Products" and "Cart (" + cart.length + ")".</li>
                  <li>If <code>screen === "products"</code>, show FlatList of products (thumbnail, title, price, "Add to Cart" button).</li>
                  <li>Otherwise show FlatList of cart items (title, price, "Remove" button) and at bottom: <code>&lt;Text&gt;Total: $&#123;total&#125;&lt;/Text&gt;</code>.</li>
                </ol>
              </div>

              <div className="record-section">
                <h3>💻 React Native Implementation (Expo SDK 54)</h3>
                <pre className="code-block scrollable">
                  <code>{expoCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Shopping Cart App • Standalone Edition • Practical 5 • Powered by DummyJSON API</p>
      </footer>
    </div>
  );
}

