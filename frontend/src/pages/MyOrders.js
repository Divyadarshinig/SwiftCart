import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, color: 'var(--rose-tan)' }}>My Orders</h2>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p>No orders yet 🛍️</p>
        </div>
      )}

      {orders.map(o => (
        <div key={o._id} className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong>Order #{o._id.slice(-6)}</strong>
            <span className={`badge status-${o.status}`}>{o.status}</span>
          </div>

          <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
            Placed: {new Date(o.createdAt).toLocaleDateString()}
          </p>

          <ul style={{ paddingLeft: 20, fontSize: 14 }}>
            {o.items.map((i, idx) => (
              <li key={idx}>
                {i.name} × {i.quantity} — ${(i.price * i.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: 8, textAlign: 'right', fontWeight: 700, color: 'var(--rose-tan)' }}>
            Total: ${o.total.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}