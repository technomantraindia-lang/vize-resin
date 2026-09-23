import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FlooringSystemsPage from './pages/FlooringSystemsPage';
import ResinsPage from './pages/ResinsPage';
import OurWorkPage from './pages/OurWorkPage';
import TableTopsPage from './pages/TableTopsPage';
import ContactUsPage from './pages/ContactUsPage';
import ColorsPigmentsPage from './pages/ColorsPigmentsPage';
import AccountPage from './pages/AccountPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import AccountModal from './components/AccountModal';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawer />
        <AccountModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<AccountPage />} />
          <Route path="/orders" element={<AccountPage />} />
          <Route path="/profile" element={<AccountPage />} />
          <Route path="/flooring-systems" element={<FlooringSystemsPage />} />
          <Route path="/resins" element={<ResinsPage />} />
          <Route path="/products" element={<ResinsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
          <Route path="/casting-art" element={<ResinsPage />} />
          <Route path="/coatings" element={<ResinsPage />} />
          <Route path="/table-tops" element={<TableTopsPage />} />
          <Route path="/colors" element={<ColorsPigmentsPage />} />
          <Route path="/colors-pigments" element={<ColorsPigmentsPage />} />
          <Route path="/colour-chart" element={<ColorsPigmentsPage />} />
          <Route path="/color-chart" element={<ColorsPigmentsPage />} />
          <Route path="/pigments" element={<ColorsPigmentsPage />} />
          <Route path="/finishes" element={<ColorsPigmentsPage />} />
          <Route path="/workshop" element={<ProductDetailPage />} />
          <Route path="/our-work" element={<OurWorkPage />} />
          <Route path="/work" element={<OurWorkPage />} />
          <Route path="/resources" element={<OurWorkPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/support" element={<ContactUsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
