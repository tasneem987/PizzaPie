import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="home-text">
        <h1>Pizza Taste</h1>
        <h2>The tasty pizza of your choice</h2>

        <div className="home-buttons">
          <Link to="/menu" className="btn btn-outline">Menu</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-outline">Register</Link>
        </div>
      </div>

      <div className="home-img">
        <img src="/images/home-img.jpg" alt="pizza" />
      </div>
    </section>
  );
};

export default Home;
