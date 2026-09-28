import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: 'General'
  });

  // Load data
  const load = async () => {
    try {
      const [o, p] = await Promise.all([
        axios.get('/orders'),
        axios.get('/products')
      ]);
      setOrders(o.data);
      setProducts(p.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Kick out non-admins
    if (!user || user.role !== 'admin') {
      nav('/');
      return;
    }
    load();
    // eslint-disable-next-line
  }, []);

  // Add a product
  const addProduct = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }

    try {
      await axios.post('/products', {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        stock: Number(form.stock) || 0,
        category: form.category || 'General'
      });
      setForm({ name: '', price: '', description: '', stock: '', category: 'General' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/orders/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <p style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, color: 'var(--rose-tan)' }}>Admin Dashboard</h2>

      {error && (
        <div style={{
          background: '#fbe4e4', color: '#8b3a3a',
          padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 14
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ---------- Add Product ---------- */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Add Product</h3>
        <form
          onSubmit={addProduct}
          style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ gridColumn: '1 / -1' }}
          />
          <button
            className="btn"
            type="submit"
            style={{ gridColumn: '1 / -1' }}
          >
            Add Product
          </button>
        </form>
      </div>

      {/* ---------- Products list ---------- */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Products ({products.length})</h3>
        {products.length === 0 && <p>No products yet.</p>}
        {products.map(p => (
          <div
            key={p._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--bridal-rose)'
            }}
          >
            <div>
              <strong>{p.name}</strong>
              <span style={{ marginLeft: 10, fontSize: 13, opacity: 0.7 }}>
                ${Number(p.price).toFixed(2)} · Stock: {p.stock} · {p.category}
              </span>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => deleteProduct(p._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ---------- Orders list ---------- */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>All Orders ({orders.length})</h3>
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map(o => (
          <div
            key={o._id}
            className="card"
            style={{ marginBottom: 12, background: 'var(--rose-quartz)' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <div>
                <strong>{o.user?.name || 'Unknown user'}</strong>
                <span style={{ marginLeft: 8, fontSize: 13, opacity: 0.7 }}>
                  ({o.user?.email})
                </span>
              </div>
              <span className={`badge status-${o.status}`}>{o.status}</span>
            </div>

            <ul style={{ paddingLeft: 20, fontSize: 14, marginBottom: 8 }}>
              {o.items.map((i, idx) => (
                <li key={idx}>{i.name} × {i.quantity} — ${(i.price * i.quantity).toFixed(2)}</li>
              ))}
            </ul>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <strong style={{ color: 'var(--rose-tan)' }}>
                Total: ${o.total.toFixed(2)}
              </strong>

              <select
                value={o.status}
                onChange={e => updateStatus(o._id, e.target.value)}
              >
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}