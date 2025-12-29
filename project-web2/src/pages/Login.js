import React, { useContext, useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CartContext } from "../data/CartContext";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(CartContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setMessage("");

  try {
    const res = await api.post("/login", { email, password });

    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/", { replace: true });
    } else {
      setMessage(res.data.message);
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setMessage("Server error");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>

<p style={{ marginTop: "10px" }}>
  Don’t have an account? <Link to="/register">Register here</Link>
</p>

      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
