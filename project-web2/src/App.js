import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./data/CartContext"; // ✅ import CartProvider
import { UserProvider } from "./data/UserContext";

import NavBar from "./component/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import AddItem from "./pages/AddItems";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import Cart from "./component/Cart"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./data/Logout";
function App() {
  return (
    <UserProvider>
    <CartProvider> {/* ✅ wrap everything in CartProvider */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
           <Route path="/add-item" element={<AddItem />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
