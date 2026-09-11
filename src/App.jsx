import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FlooringSystemsPage from './pages/FlooringSystemsPage';
import ResinsPage from './pages/ResinsPage';
import OurWorkPage from './pages/OurWorkPage';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <CartProvider>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/flooring-systems" element={<FlooringSystemsPage />} />
        <Route path="/resins" element={<ResinsPage />} />
        <Route path="/products" element={<ResinsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/casting-art" element={<ResinsPage />} />
        <Route path="/coatings" element={<ResinsPage />} />
        <Route path="/table-tops" element={<ProductDetailPage />} />
        <Route path="/workshop" element={<ProductDetailPage />} />
        <Route path="/our-work" element={<OurWorkPage />} />
        <Route path="/work" element={<OurWorkPage />} />
        <Route path="/resources" element={<OurWorkPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </CartProvider>
  );
}

export default App;


