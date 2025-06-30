import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../../services/login-service'
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/patients')
    } catch {
      setError('Login ou Senha inválido.')
    }
  }

  return (
    
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="login-form-group">
        <input
          type="email"
          id="email"
          value={email}
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="login-form-group">
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-button">
        Login
      </button>
    </form>
  );
}

export default Login;
