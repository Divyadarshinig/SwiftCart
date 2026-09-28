import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const nav = useNavigate();

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, color: 'var(--rose-tan)' }}>Your Cart</h2>
      {cart.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p>Your cart is empty 🛍️</p>
        </div>
      )}
      {cart.map(i => (
        <div key={i._id} className="card"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <strong>{i.name}</strong>
            <p style={{ fontSize: 13, opacity: 0.7 }}>${i.price} × {i.quantity}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <strong style={{ color: 'var(--rose-tan)' }}>${(i.price * i.quantity).toFixed(2)}</strong>
            <button className="btn btn-outline" onClick={() => removeFromCart(i._id)}>Remove</button>
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="card" style={{ marginTop: 24, textAlign: 'right' }}>
          <h3>Total: <span style={{ color: 'var(--rose-tan)' }}>${total.toFixed(2)}</span></h3>
          <button className="btn" style={{ marginTop: 12 }} onClick={() => nav('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}