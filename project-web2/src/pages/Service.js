import React from "react";
import "../styles/Service.css";
const Service = () => (
  <section className="services">
    <div className="heading">
      <span>Services</span>
      <h2>We provide best food services</h2>
    </div>

    <div className="services-container">
      <div className="s-box">
        <img src="./images/s-box1.jpeg" alt="order" />
        <h3>You Order</h3>
        <p>Customize your perfect pizza...</p>
      </div>

      <div className="s-box">
        <img src="./images/s-box2.jpeg" alt="delivery" />
        <h3>Delivered</h3>
        <p>Fast delivery & tracking!</p>
      </div>

      <div className="s-box">
        <img src="./images/s-box3.jpeg.png" alt="service" />
        <h3>Best Service</h3>
        <p>High quality and fresh ingredients</p>
      </div>
    </div>
  </section>
);

export default Service;