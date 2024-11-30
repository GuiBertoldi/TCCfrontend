import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://54.82.234.106:8080/auth/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/patient-register");
    } catch (err) {
      console.error(err);
      setError("Login ou Senha inválido.");
    }
  };

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
