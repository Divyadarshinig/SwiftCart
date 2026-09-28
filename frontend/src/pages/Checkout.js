import { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [address, setAddress] = useState({
    street: '', city: '', zip: '', country: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--rose-tan)' }}>Please log in first</h2>
        <Link to="/login" className="btn" style={{ display: 'inline-block', marginTop: 20 }}>
          Go to Login
        </Link>
      </div>
    );
  }

  // Handle empty cart
  if (cart.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--rose-tan)' }}>Your cart is empty 🛍️</h2>
        <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: 20 }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setError('');

    // Validate address
    if (!address.street || !address.city || !address.zip || !address.country) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/orders', {
        items: cart.map(i => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: address
      });
      clearCart();
      nav('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, color: 'var(--rose-tan)' }}>Checkout</h2>

      {/* Order Summary */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Order Summary</h3>
        {cart.map(i => (
          <div key={i._id} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--bridal-rose)'
          }}>
            <span>{i.name} × {i.quantity}</span>
            <span>${(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ textAlign: 'right', marginTop: 12, fontSize: 18, fontWeight: 700 }}>
          Total: <span style={{ color: 'var(--rose-tan)' }}>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping form */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Shipping Address</h3>

        {error && (
          <div style={{
            background: '#fbe4e4', color: '#8b3a3a',
            padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 14
          }}>
            ⚠️ {error}
          </div>
        )}

        <input
          placeholder="Street"
          value={address.street}
          onChange={e => setAddress({ ...address, street: e.target.value })}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <input
          placeholder="City"
          value={address.city}
          onChange={e => setAddress({ ...address, city: e.target.value })}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <input
          placeholder="Zip"
          value={address.zip}
          onChange={e => setAddress({ ...address, zip: e.target.value })}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <input
          placeholder="Country"
          value={address.country}
          onChange={e => setAddress({ ...address, country: e.target.value })}
          style={{ width: '100%', marginBottom: 20 }}
        />

        <button
          className="btn"
          style={{
            width: '100%',
            opacity: submitting ? 0.6 : 1,
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
          onClick={placeOrder}
          disabled={submitting}
        >
          {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}