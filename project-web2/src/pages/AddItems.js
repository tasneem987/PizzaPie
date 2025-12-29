import api from "../api/axios";
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AddItems.css";
import { CartContext } from "../data/CartContext";

const AddMenu = () => {
  const { user } = useContext(CartContext);
  const navigate = useNavigate();

  const [item, setItem] = useState({ name: "", price: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.email === "admin@pizzapie.com");
  }, [user]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAdmin) {
      setError("Only admin can add menu items");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("price", item.price);
      formData.append("image", image);

      await api.post("/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/menu");
    } catch (err) {
      console.error("Add menu item error:", err);
      setError("Failed to add item");
    }
  };

  if (!user) {
    return (
      <div className="add-item">
        <h2>You must be logged in</h2>
        <Link to="/menu">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="add-item">
      <form className="add-item-card" onSubmit={handleSubmit}>
        <h1>Add Menu Item</h1>

        <input
          type="text"
          name="name"
          placeholder="Item name"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Add Item</button>

        {error && <p className="error">{error}</p>}
        <Link to="/menu">Back to Menu</Link>
      </form>
    </div>
  );
};

export default AddMenu;
