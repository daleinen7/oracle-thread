import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '../auth/AuthProvider';
import Layout from '../components/Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formIsLogin, setFormIsLogin] = useState(true);

  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsLogin) {
      await login(email, password);
      navigate('/');
    } else {
      await signup(email, password);
      setFormIsLogin(true);
    }
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
