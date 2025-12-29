import React, { useContext } from "react";
import { CartContext } from "../data/CartContext";
import "../styles/Cart.css";

const CartPage = () => {
  const {
    cart,
    totalPrice,
    loadingCart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  if (loadingCart) {
    return (
      <div className="cart-page">
        <h1>Loading cart...</h1>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cart.map((item) => {
          const price = Number(item.price) || 0;
          const quantity = Number(item.quantity) || 0;
          const name = item.name || "Unnamed item";
          const img = item.img || "placeholder.png";

          return (
            <li key={item.menuId} className="cart-item">
              <img src={`/images/${img}`} alt={name} className="cart-img" />
              <div>
                <h3>{name}</h3>
                <p>
                  ${price.toFixed(2)} x {quantity} = ${(price * quantity).toFixed(2)}
                </p>
                <div className="cart-buttons">
                  <button onClick={() => decreaseQuantity(item.menuId)}>-</button>
                  <button onClick={() => addToCart(item)}>+</button>
                  <button onClick={() => removeFromCart(item.menuId)}>Remove</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <h2>Total: ${Number(totalPrice).toFixed(2)}</h2>

      <button className="btn-clear" onClick={clearCart}>
        Clear Cart
      </button>
      <button
        className="btn-purchase"
        onClick={() => alert("Purchase coming soon!")}
      >
        Purchase
      </button>
    </div>
  );
};

export default CartPage;
