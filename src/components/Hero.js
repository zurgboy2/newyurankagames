import React from "react";
import "./Hero.css";
import cardsImage from "../assets/div.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleJoinEvents = () => {
    navigate("/events"); // Navigate to the reservations page
  };
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Discover the Ultimate Hub for Trading Card Games, Board Games and
          Video Games in Riga, Latvia.
        </h1>
        <p className="hero-subtitle">
          Explore our exclusive collection of trading cards, connect with
          passionate gamers, and compete in tournaments—all under one roof.
        </p>
        <div className="hero-buttons">
          <button
            className="red-button"
            onClick={() => window.open("https://store.yuranka.com", "_blank")}
          >
            Visit Our Store
          </button>

          <button className="white-button" onClick={handleJoinEvents}>
            Join an Event
          </button>
          <button
            className="second-red-button"
            onClick={() => {
              navigate("/reservations");
            }}
          >
            {" "}
            Book A Table
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img src={cardsImage} alt="Gaming Store" />
      </div>
    </section>
  );
};

export default Hero;
