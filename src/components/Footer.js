import React from "react";
import {
  FaInstagram,
  FaDiscord,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Red Dash */}
      <div className="footer-dash1"></div>

      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Yuranka Games</h3>
          <p className="footer-subtext">
            Your Ultimate Gaming experience in Riga, Latvia.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3 className="footer-heading">Quick Links</h3>
          <a href="https://store.yuranka.com">Store</a>
          <Link to="/events">Events</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/boardgames">Board Games</Link>
          <Link to="/videogames">Video Games</Link>
          <Link to="/about">About Us</Link>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="contact-heading">Contact</h3>
          <div className="contact-info">
            <FaPhone className="icon" /> <span>+371 27 460 885</span>
          </div>
          <div className="contact-info">
            <FaEnvelope className="icon" /> <span>support@yuranka.com</span>
          </div>
          <div className="contact-info">
            <FaMapMarkerAlt className="icon" />{" "}
            <span>Matīsa iela 25, Centra rajons, Rīga, LV-1001, Latvia</span>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-section ">
          <h3 className="footer-heading fourth-heading">Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/yurankatcg/" target="_blank">
              <FaInstagram />
            </a>
            <a href="https://discord.com/invite/dDccDK3SnN" target="_blank">
              <FaDiscord />
            </a>
            <a
              href="https://chat.whatsapp.com/FQrgdr4hxAD4POP4lmekL2"
              target="_blank"
            >
              <FaWhatsapp />
            </a>
            <a href="https://www.tiktok.com/@yuranka.games" target="_blank">
              <FaTiktok />
            </a>
            <a href="https://www.youtube.com/@YurankaTCG" target="_blank">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Red Dash */}
      <div className="footer-dash2"></div>

      {/* All Rights Reserved */}
      <div className="footer-bottom">
        <p>© 2025 Yuranka Games. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
