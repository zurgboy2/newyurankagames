import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBars, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.avif";
import { Link, useNavigate } from "react-router-dom";
import avatarImg from "../assets/logo.avif";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const username = sessionStorage.getItem("username");

  const closeNavigation = () => {
    setMenuOpen(false);
    setEventsDropdownOpen(false);
  };

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

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

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
          <Link to="/" onClick={closeNavigation}>
            Home
          </Link>
        </li>
        <li>
          <a href="https://store.yuranka.com" onClick={closeNavigation}>
            Store
          </a>
        </li>
        <li
          className="events-dropdown"
          onMouseEnter={handleEventsHover}
          onMouseLeave={handleEventsLeave}
        >
          <div className="events-dropdown-trigger">
            <Link to="/events" onClick={closeNavigation}>
              Events
            </Link>
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
              <Link to="/events" onClick={closeNavigation}>
                Main Events
              </Link>
            </li>
            <li>
              <Link to="/minicons" onClick={closeNavigation}>
                Minicons
              </Link>
            </li>
            <li>
              <Link to="/starwars" onClick={closeNavigation}>
                Star Wars
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/reservations" onClick={closeNavigation}>
            Reservations
          </Link>
        </li>
        <li>
          <a href="#boardgames" onClick={closeNavigation}>
            Board Games
          </a>
        </li>
        <li>
          <a href="#videogames" onClick={closeNavigation}>
            Video Games
          </a>
        </li>
        <li>
          <Link to="/about" onClick={closeNavigation}>
            About Us
          </Link>
        </li>
        <li>
          <Link to="/careers" onClick={closeNavigation}>
            Careers
          </Link>
        </li>
        <li>
          <Link to="/buyout" onClick={closeNavigation}>
            Sell Cards
          </Link>
        </li>

        {/* Auth Buttons for Mobile */}
        {sessionStorage.getItem("username") ? (
          <li className="mobile-auth">
            <div
              className="mobile-user-profile"
              onClick={() => {
                closeNavigation();
                navigate("/dashboard");
              }}
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
                  closeNavigation() ||
                  navigate("/login&signup", {
                    state: { isLogin: true },
                    replace: true,
                  })
                }
              >
                Login
              </button>
            </li>
            <li className="mobile-auth">
              <button
                className="signup"
                onClick={() =>
                  closeNavigation() ||
                  navigate("/login&signup", {
                    state: { isLogin: false },
                    replace: true,
                  })
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
        <div
          className="user-profile"
          onClick={() => {
            closeNavigation();
            navigate("/dashboard");
          }}
        >
          <img src={avatarImg} alt="User Avatar" className="avatar" />
          <span className="username">{username}</span>
        </div>
      ) : (
        <div className="auth-buttons">
          <button
            className="signin"
            onClick={() =>
              closeNavigation() ||
              navigate("/login&signup", {
                state: { isLogin: true },
                replace: true,
              })
            }
          >
            Login
          </button>
          <button
            className="signup"
            onClick={() =>
              closeNavigation() ||
              navigate("/login&signup", {
                state: { isLogin: false },
                replace: true,
              })
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
