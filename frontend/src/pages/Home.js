import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/products')
      .then(r => setProducts(r.data))
      .catch(err => {
        console.error(err);
        setError('Could not load products. Is the backend running?');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="hero">
        <h1>SwiftCart</h1>
        <p>Elegance delivered. Shop the Rose Satin Collection.</p>
      </div>

      {loading && (
        <p style={{ padding: 24, textAlign: 'center' }}>Loading products...</p>
      )}

      {error && (
        <p style={{ padding: 24, textAlign: 'center', color: 'var(--rose-tan)' }}>
          ⚠️ {error}
        </p>
      )}

      <div className="product-grid">
        {!loading && !error && products.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
            <p>No products yet. Login as admin to add some! 🛍️</p>
          </div>
        )}

        {products.map(p => {
          const outOfStock = p.stock <= 0;
          return (
            <div key={p._id} className="card">
              <div style={{
                height: 140,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f7d9db, #ebc2c2, #ffe4e1)',
                marginBottom: 12
              }} />

              {p.category && <span className="badge">{p.category}</span>}

              <h3 style={{ margin: '10px 0 6px' }}>{p.name}</h3>

              <p style={{ fontSize: 14, opacity: 0.75, minHeight: 40 }}>
                {p.description || 'No description available.'}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12
              }}>
                <strong style={{ fontSize: 20, color: 'var(--rose-tan)' }}>
  {formatPrice(p.price)}
</strong>
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                  {outOfStock ? 'Out of stock' : `Stock: ${p.stock}`}
                </span>
              </div>

              <button
                className="btn"
                style={{
                  width: '100%',
                  marginTop: 12,
                  opacity: outOfStock ? 0.5 : 1,
                  cursor: outOfStock ? 'not-allowed' : 'pointer'
                }}
                disabled={outOfStock}
                onClick={() => addToCart(p)}
              >
                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}