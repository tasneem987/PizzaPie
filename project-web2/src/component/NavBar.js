import React, { useContext } from "react";
import "../styles/NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../data/CartContext";

const NavBar = () => {
  const { cart, user, setUser } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login"); // redirect to login after logout
  };

  return (
    <header>
      <Link to="/" className="logo">Pizza Pie</Link>

      <ul className="navbar">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/service">Service</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
        <li>
          <Link to="/cart" className="cart-icon">
            🛒 {cart && cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>
        </li>

        {/* Logout button only visible if user is logged in */}
        {user && (
          <li>
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </header>
  );
};

export default NavBar;
