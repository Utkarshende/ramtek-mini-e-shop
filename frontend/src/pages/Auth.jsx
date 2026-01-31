import React, { useState } from 'react';
import API from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await API.post(endpoint, formData);
      localStorage.setItem('token', res.data.token);
      alert("Welcome to Ramtek Bazar!");
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || "Auth Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input 
              style={styles.input} 
              placeholder="Full Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          )}
          <input 
            style={styles.input} 
            placeholder="Email Address" 
            type="email" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            style={styles.input} 
            placeholder="Password" 
            type="password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button style={styles.button}>{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p style={styles.toggleText} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  card: { padding: '40px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', width: '350px', textAlign: 'center' },
  title: { color: '#f8fafc', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' },
  button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: '0.3s' },
  toggleText: { color: '#94a3b8', marginTop: '15px', cursor: 'pointer', fontSize: '14px' }
};

export default Auth;e