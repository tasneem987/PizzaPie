import React, { useContext } from "react";
import { CartContext } from "../data/CartContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setUser } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login"); // redirect to login after logout
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default Logout;
