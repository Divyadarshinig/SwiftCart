import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🛍️ SwiftCart</Link>
      <Link to="/">Shop</Link>
      <Link to="/cart">
  Cart
  {cart.length > 0 && (
    <span style={{
      background: 'var(--rose-tan)',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 8px',
      marginLeft: 6,
      fontSize: 12,
      fontWeight: 700
    }}>
      {cart.length}
    </span>
  )}
</Link>
      {user && <Link to="/orders">My Orders</Link>}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <span style={{ fontWeight: 600 }}>Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}