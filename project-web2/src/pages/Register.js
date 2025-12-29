import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios instance
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setMessage("Registration successful!");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.log("AXIOS REGISTER ERROR:", error.response);
      setMessage(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
  Already have an account? <Link to="/login">Login here</Link>
</p>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
