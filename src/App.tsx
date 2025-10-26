import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";

// Protected Route Components
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ArtistsManagement from "./pages/admin/ArtistsManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
            <Routes>
              {/* Admin Login Route (No Layout) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes (Protected) */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="artists" element={<ArtistsManagement />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="orders" element={<OrdersManagement />} />
              </Route>

              {/* Public Routes with Navigation & Footer */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-1">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/artists" element={<Artists />} />
                        <Route path="/artist/:id" element={<ArtistDetail />} />
                        <Route path="/about" element={<About />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected Routes (User) */}
                        <Route 
                          path="/profile" 
                          element={
                            <UserRoute>
                              <Profile />
                            </UserRoute>
                          } 
                        />
                        <Route 
                          path="/checkout" 
                          element={
                            <UserRoute>
                              <Checkout />
                            </UserRoute>
                          } 
                        />
                        <Route 
                          path="/order/:id" 
                          element={
                            <UserRoute>
                              <OrderDetail />
                            </UserRoute>
                          } 
                        />
                        
                        {/* 404 - Must be last */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
