import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBars, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.png"; // Make sure to replace this with your actual logo path
import { Link, useNavigate } from "react-router-dom";
import avatarImg from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".nav-links") &&
        !event.target.closest(".menu-icon")
      ) {
        setMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  // Add event listener

  const toggleEventsDropdown = (e) => {
    e.stopPropagation();
    setEventsDropdownOpen(!eventsDropdownOpen);
  };

  const handleEventsHover = (e) => {
    e.stopPropagation();
    setEventsDropdownOpen(true);
  };

  const handleEventsLeave = (e) => {
    e.stopPropagation();
    setEventsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Hamburger Menu (Mobile) */}
      <div
        className="menu-icon"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
      >
        <FaBars />
        {/* {menuOpen ? <FaTimes /> : <FaBars />} */}
      </div>

      {/* Logo on the left side */}
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="YurankaGames Logo" className="logo" />
        </Link>
      </div>

      {/* Navigation Links inside an oval */}
      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a href="https://store.yuranka.com">Store</a>
        </li>
        <li
          className="events-dropdown"
          onMouseEnter={handleEventsHover}
          onMouseLeave={handleEventsLeave}
        >
          <div className="events-dropdown-trigger">
            <Link to="/events">Events</Link>
            <FaChevronDown
              className={`dropdown-arrow ${eventsDropdownOpen ? "open" : ""}`}
            />
          </div>
          <ul
            className={`events-dropdown-menu ${
              eventsDropdownOpen ? "active" : ""
            }`}
          >
            <li>
              <Link to="/events">Main Events</Link>
            </li>
            <li>
              <Link to="/minicons">Minicons</Link>
            </li>
            <li>
              <Link to="/starwars">Star Wars</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/reservations">Reservations</Link>
        </li>
        <li>
          <a href="#boardgames">Board Games</a>
        </li>
        <li>
          <a href="#videogames">Video Games</a>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>

        {/* Auth Buttons for Mobile */}
        {sessionStorage.getItem("username") ? (
          <li className="mobile-auth">
            <div
              className="mobile-user-profile"
              onClick={() => navigate("/dashboard")}
            >
              <img
                src={avatarImg}
                alt="User Avatar"
                className="mobile-avatar"
              />
              <span className="mobile-username">
                {sessionStorage.getItem("username")}
              </span>
            </div>
          </li>
        ) : (
          <>
            <li className="mobile-auth">
              <button
                className="signin"
                onClick={() =>
                  navigate("/login&signup", { state: { isLogin: true } })
                }
              >
                Login
              </button>
            </li>
            <li className="mobile-auth">
              <button
                className="signup"
                onClick={() =>
                  navigate("/login&signup", { state: { isLogin: false } })
                }
              >
                Sign Up
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Auth Buttons */}
      {username ? (
        <div className="user-profile" onClick={() => navigate("/dashboard")}>
          <img src={avatarImg} alt="User Avatar" className="avatar" />
          <span className="username">{username}</span>
        </div>
      ) : (
        <div className="auth-buttons">
          <button
            className="signin"
            onClick={() =>
              navigate("/login&signup", { state: { isLogin: true } })
            }
          >
            Login
          </button>
          <button
            className="signup"
            onClick={() =>
              navigate("/login&signup", { state: { isLogin: false } })
            }
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
