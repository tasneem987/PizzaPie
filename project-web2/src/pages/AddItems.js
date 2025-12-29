import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AddItems.css";
import { CartContext } from "../data/CartContext";

const AddMenu = () => {
  const { user } = useContext(CartContext);
  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: "",
    price: "",
    img: "",
  });

  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Check admin
  useEffect(() => {
    if (user && user.email === "admin@pizzapie.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setItem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAdmin) {
      setError("Only the admin can add menu items.");
      return;
    }

    if (!item.name || !item.price || !item.img) {
      setError("Please fill all fields.");
      return;
    }

    try {
      await axios.post(
        "https://pizzapie-backend.onrender.com/menu",
        {
          name: item.name,
          price: item.price,
          img: item.img,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/menu");
    } catch (err) {
      console.error("Add menu item error:", err);
      setError("Failed to add item.");
    }
  };

  // ❌ Not logged in
  if (!user) {
    return (
      <div className="add-item">
        <div className="add-item-card">
          <h2>You must be logged in to add items.</h2>
          <Link to="/menu" className="link">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="add-item">
      <div className="add-item-card">
        <h1>Add Menu Item</h1>

        {!isAdmin && (
          <p style={{ color: "red" }}>
            Only the admin can add menu items.
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={item.name}
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={item.price}
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <input
          type="text"
          name="img"
          placeholder="Image URL (https://...)"
          value={item.img}
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <button onClick={handleSubmit} disabled={!isAdmin}>
          Add Item
        </button>

        {error && <span className="error">{error}</span>}

        <Link to="/menu" className="link">
          Back to Menu
        </Link>
      </div>
    </div>
  );
};

export default AddMenu;
