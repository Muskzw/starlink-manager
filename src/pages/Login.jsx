import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return setError("Email is required");
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--bg-color) 0%, #d8e2ff 100%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          <Wifi size={48} />
        </div>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          Sign in to Starlink Manager
        </p>
        
        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Corporate Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="e.g., alice@starops.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '1rem', fontSize: '1rem' }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Sign In Securely <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            For testing, use: <b>alice@starops.com</b>
          </span>
        </div>
      </div>
    </div>
  );
}
