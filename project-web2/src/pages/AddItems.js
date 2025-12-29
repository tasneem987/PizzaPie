import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AddItems.css";
import { CartContext } from "../data/CartContext";

const AddItem = () => {
  const { user } = useContext(CartContext);
  const [item, setItem] = useState({ name: "", price: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Optional: show a message if not admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.email === "admin@pizzapie.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAdmin) {
      setError("Only the admin can add menu items.");
      return;
    }

    if (!item.name || !item.price || !image) {
      setError("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("price", item.price);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/menu", formData);
      navigate("/menu");
    } catch (err) {
      console.error("Add item error:", err);
      setError("Failed to add item. Check console for details.");
    }
  };

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
          <p style={{ color: "red" }}>Only the admin can add menu items.</p>
        )}

        <input
          type="text"
          placeholder="Item name"
          name="name"
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <input
          type="number"
          placeholder="Price"
          name="price"
          step="0.01"
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={!isAdmin}
        />

        <button onClick={handleClick} disabled={!isAdmin}>
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

export default AddItem;
