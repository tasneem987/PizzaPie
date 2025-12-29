import React, { useContext, useEffect, useState } from "react";
import "../styles/Menu.css";
import { CartContext } from "../data/CartContext";
import api from "../api/axios"; // Axios instance
import { Link } from "react-router-dom";

const Menu = () => {
  const { addToCart, user } = useContext(CartContext);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedItemId, setAddedItemId] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get("/menu");
        setMenuItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1000);
  };

const handleDelete = async (itemId) => {
  if (!user) {
    alert("You must be logged in to delete an item");
    return;
  }

  if (window.confirm("Are you sure you want to delete this item?")) {
    try {
      // Send userEmail as query param
      await api.delete(`/menu/${itemId}?userEmail=${user.email}`);
      // Remove item from state so it disappears from UI
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Delete item error:", err.response || err);
      alert(
        err.response?.data?.message || "Failed to delete item due to server error"
      );
    }
  }
};


  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading menu...</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <section className="menu">
      <div className="heading">
        <div className="heading menu-header">
          <div>
            <span>Menu</span>
            <h2>Tasty menu of the week</h2>
          </div>

          <Link to="/add-item" className="add-item-btn">
            + Add Item
          </Link>
        </div>
      </div>

      <div className="menu-container">
        {menuItems.map((item) => (
          <div className="box" key={item.id}>
            <div className="box-img">
              <img
  src={`https://pizzapie-backend.onrender.com${item.img}`}
  alt={item.name}
/>

            </div>

            <h2>{item.name}</h2>
            <h3>Tasty Food</h3>
            <span>${item.price}</span>

            <button
              className="btn"
              onClick={() => handleAdd(item)}
            >
              Add to Cart
            </button>

            {addedItemId === item.id && (
              <span className="added-msg">Added!</span>
            )}

            {/* Delete button visible to all */}
            <button
              className="btn delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
