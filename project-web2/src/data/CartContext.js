import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load cart after user
  useEffect(() => {
    if (user && !initialized) {
      loadCart(user.id);
      setInitialized(true);
    }
  }, [user, initialized]);

  const loadCart = async (userId) => {
  try {
    const res = await api.get(`/cart/${userId}`);

    const safeCart = res.data.map(item => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    setCart(safeCart);
  } catch (err) {
    console.error("Load cart error:", err);
  }
};


  const saveCart = async (updatedCart) => {
    if (!user) return;

    try {
      await api.post("/cart", {
        user_id: user.id,
        cart: updatedCart,
      });
    } catch (err) {
      console.error("Save cart error:", err);
    }
  };

 const addToCart = (item) => {
  const menuId = item.menuId || item.id;

  const updatedCart = cart.find(i => i.menuId === menuId)
    ? cart.map(i =>
        i.menuId === menuId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    : [
        ...cart,
        {
          menuId,
          name: item.name,
          price: item.price,
          img: item.img,
          quantity: 1,
        },
      ];

  setCart(updatedCart);
  saveCart(updatedCart);
};


  const decreaseQuantity = (menuId) => {
    const updatedCart = cart
      .map(i =>
        i.menuId === menuId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      .filter(i => i.quantity > 0);

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = (menuId) => {
    const updatedCart = cart.filter(i => i.menuId !== menuId);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  // ✅ TOTAL PRICE FIX
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        setUser,
        totalPrice,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
