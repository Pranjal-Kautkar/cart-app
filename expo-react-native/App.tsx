// Expo SDK 54 - Practical 5: Product List with Add to Cart
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

// Resilient fallback products in case of offline/network limits
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
  {
    id: 4,
    title: 'Red Lipstick',
    price: 12.99,
    category: 'beauty',
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png',
  },
  {
    id: 5,
    title: 'Red Nail Polish',
    price: 8.99,
    category: 'beauty',
    thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png',
  },
  {
    id: 6,
    title: 'Calvin Klein CK One',
    price: 49.99,
    category: 'fragrances',
    thumbnail: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png',
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

  // Fetch product list from DummyJSON API with error handling and fallback
  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('https://dummyjson.com/products?limit=30');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err: any) {
      console.warn('DummyJSON fetch error:', err?.message || err);
      // Keep existing products or fallback so UI never breaks
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

  // Add product to cart or increment quantity if already present
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

  // Increase quantity of item in cart
  const increaseQuantity = (productId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity or remove if reaching 0
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

  // Remove item completely from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear all items with confirmation
  const clearCart = () => {
    if (cart.length === 0) return;
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setCart([]) },
    ]);
  };

  // Checkout simulation
  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert(
      'Order Successful! 🎉',
      `Thank you for your purchase of $${totalPrice.toFixed(2)}. Your order is confirmed!`,
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

  // Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // Search filter
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart App</Text>
          <Text style={styles.headerSubtitle}>Practical 5 • DummyJSON API</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.tabButton, screen === 'products' && styles.tabButtonActive]}
          onPress={() => setScreen('products')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabButtonText, screen === 'products' && styles.tabButtonTextActive]}>
            Products ({products.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, screen === 'cart' && styles.tabButtonActive]}
          onPress={() => setScreen('cart')}
          activeOpacity={0.7}
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

      {/* Screen 1: Products List */}
      {screen === 'products' ? (
        <View style={styles.contentContainer}>
          {/* Search Bar */}
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
              ListEmptyComponent={
                <View style={styles.centerContainer}>
                  <Text style={styles.emptyTitle}>No products found</Text>
                  <Text style={styles.emptySubtitle}>Try adjusting your search query</Text>
                </View>
              }
              renderItem={({ item }) => {
                const inCart = cart.find((c) => c.id === item.id);
                return (
                  <View style={styles.productCard}>
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                      {inCart && (
                        <Text style={styles.inCartIndicator}>In Cart: {inCart.quantity}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addButtonText}>
                        {inCart ? '+ Add More' : 'Add to Cart'}
                      </Text>
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
              <Text style={styles.emptySubtitle}>
                Add items from the product catalog to get started.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => setScreen('products')}
                activeOpacity={0.8}
              >
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
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.cartImage}
                      resizeMode="cover"
                    />
                    <View style={styles.cartInfo}>
                      <Text style={styles.cartTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.cartUnitPrice}>
                        ${item.price.toFixed(2)} each
                      </Text>
                      <Text style={styles.cartSubtotal}>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>

                    {/* Quantity Controls */}
                    <View style={styles.cartActions}>
                      <View style={styles.quantityRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decreaseQuantity(item.id)}
                          activeOpacity={0.6}
                        >
                          <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyNumber}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => increaseQuantity(item.id)}
                          activeOpacity={0.6}
                        >
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeFromCart(item.id)}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />

              {/* Order Summary & Checkout Box */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Items:</Text>
                  <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Price:</Text>
                  <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={clearCart}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearBtnText}>Clear Cart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleCheckout}
                    activeOpacity={0.8}
                  >
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
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
  tabButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  cartTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
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
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  retryBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  emptyCartIcon: {
    fontSize: 54,
  },
  browseButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
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
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginTop: 3,
  },
  inCartIndicator: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
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
  cartImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  cartInfo: {
    flex: 1,
  },
  cartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  cartUnitPrice: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cartSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  cartActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  qtyNumber: {
    width: 28,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  removeBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  removeBtnText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  clearBtnText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  checkoutBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
