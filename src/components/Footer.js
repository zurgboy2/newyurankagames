import {
  FaInstagram,
  FaDiscord,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <footer className="text-white/70 bg-background">
      <hr className="border-t" />

      <div className="container grid grid-cols sm:grid-flow-col md:grid-cols-3 gap-8 py-4 text-sm">
        {/* Brand Section */}
        <div>
          <h3 className="font-bold text-base text-foreground mb-2">
            Yuranka Games
          </h3>
          <p className="footer-subtext">
            Your Ultimate Gaming experience in Riga, Latvia.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base text-foreground mb-2">
            Quick Links
          </h3>
          <Link to="https://store.yuranka.com" className="w-fit link">
            Store
          </Link>
          <Link to="/events" className="w-fit link">
            Events
          </Link>
          <Link to="/reservations" className="w-fit link">
            Reservations
          </Link>
          <Link to="/boardgames" className="w-fit link">
            Board Games
          </Link>
          <Link to="/videogames" className="w-fit link">
            Video Games
          </Link>
          <Link to="/about" className="w-fit link">
            About Us
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {/* Contact Info */}
          <div className="flex flex-col gap-2 max-w-60">
            <h3 className="font-bold text-base text-foreground mb-2">
              Contact
            </h3>
            <div className="flex items-center gap-2">
              <FaPhone className="text-highlight size-5" />
              <span>+371 27 460 885</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-highlight size-5" />
              <span>support@yuranka.com</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-5">
                <FaMapMarkerAlt className="text-highlight size-5" />
              </div>
              <span>Matīsa iela 25, Centra rajons, Rīga, LV-1001, Latvia</span>
            </div>
          </div>
          {/* Social Media */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-base text-foreground mb-2">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/yurankatcg/" target="_blank">
                <FaInstagram className="text-highlight size-6" />
              </a>
              <a href="https://discord.com/invite/dDccDK3SnN" target="_blank">
                <FaDiscord className="text-highlight size-6" />
              </a>
              <a
                href="https://chat.whatsapp.com/FQrgdr4hxAD4POP4lmekL2"
                target="_blank"
              >
                <FaWhatsapp className="text-highlight size-6" />
              </a>
              <a href="https://www.tiktok.com/@yuranka.games" target="_blank">
                <FaTiktok className="text-highlight size-6" />
              </a>
              <a href="https://www.youtube.com/@YurankaTCG" target="_blank">
                <FaYoutube className="text-highlight size-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t" />

      {/* All Rights Reserved */}
      <div className="py-4 text-center">
        <p>© 2025 Yuranka Games. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
