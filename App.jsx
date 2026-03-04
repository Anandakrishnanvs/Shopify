import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminRoute from './components/AdminRoute';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-light-blue selection:bg-primary selection:text-white">
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e40af',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                },
              }}
            />
            <Header />
            {/* 
                pt-16 for mobile header height 
                md:pt-20 for desktop header height
                pb-16 for mobile bottom nav height
                md:pb-0 since bottom nav is hidden on desktop
            */}
            <main className="flex-grow pt-[115px] sm:pt-[70px] md:pt-[75px] pb-20 md:pb-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:category" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;