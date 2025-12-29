import React from "react";
import "../styles/Contact.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-heading">
        <h2>Contact Us</h2>
        <p>We would love to hear from you! Reach out anytime.</p>
      </div>

      <div className="contact-container">

        {/* Box 1 – Social */}
        <div className="contact-box">
          <h3>Pizza Pie</h3>
          <span>Connect With Us</span>
          <div className="social">
            <a href="https://instagram.com/pizzapie"><InstagramIcon /> @pizzapie</a>
            <a href="https://twitter.com/pizzapie"><TwitterIcon /> @pizzapie</a>
            <a href="https://facebook.com/pizzapie"><FacebookIcon /> Pizza Pie</a>
         </div>
        </div>

        {/* Box 2 – Menu Links */}
        <div className="contact-box">
          <h3>Menu Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/services">Service</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/reviews">Reviews</a></li>
          </ul>
        </div>

        {/* Box 3 – Address */}
        <div className="contact-box address">
          <h3>Contact</h3>
          <p><strong>Address:</strong> Lebanon, Bekaa - Kab Elias Main Road</p>
          <p><strong>Phone:</strong> +961 76 735 324</p>
          <p><strong>Email:</strong> pizzapie@gmail.com</p>
        </div>

      </div>
    </section>
  );
};

export default Contact;
