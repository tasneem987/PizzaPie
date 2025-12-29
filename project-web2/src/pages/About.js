import React from "react";
import "../styles/About.css";
const About = () => (
  <section className="about">
    <div className="about-img">
      <img src="./images/about-img.jpg" alt="about pizza" />
    </div>

    <div className="about-text">
      <span>About Us</span>
      <h2>We make good and tasty pizzas</h2>
      <p>
        Slice into Happiness: Elevate Your Taste Experience with our
        irresistible pizzas!
      </p>
      <button className="btn">Learn More</button>
    </div>
  </section>
);

export default About;
