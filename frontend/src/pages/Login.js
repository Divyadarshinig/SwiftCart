import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/'); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <form onSubmit={submit} className="card" style={{ width: 380, padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--rose-tan)' }}>
          Welcome to SwiftCart
        </h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
          style={{ width: '100%', marginBottom: 16 }} />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', marginBottom: 24 }} />
        <button className="btn" style={{ width: '100%' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
          New here? <Link to="/register" style={{ color: 'var(--rose-tan)', fontWeight: 600 }}>Create account</Link>
        </p>
      </form>
    </div>
  );
}