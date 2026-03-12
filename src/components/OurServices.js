import "./OurServices.css";
import serviceimg1 from "../assets/serviceimg1.avif";
import smallLogo1 from "../assets/small-logo1.avif";
import smallLogo2 from "../assets/small-logo2.avif";
import smallLogo3 from "../assets/small-logo3.avif";
import serviceimg2 from "../assets/serviceimg2.avif";
import smallLogo4 from "../assets/small-logo4.avif";
import smallLogo5 from "../assets/small-logo5.avif";
import serviceimg3 from "../assets/serviceimg3.avif";
import smallLogo6 from "../assets/small-logo6.avif";
import smallLogo7 from "../assets/small-logo7.avif";
import smallLogo8 from "../assets/small-logo8.avif";
import { useNavigate } from "react-router-dom";

const OurServices = () => {
  const navigate = useNavigate(); 

  const handleReserveTable = () => {
    navigate("/reservations"); 
  };

  const handleViewEvents = () => {
    navigate("/events"); 
  };
  return (
    <section class="services-section">
      <h2 class="services-heading">Our Services</h2>

      <div class="services1-content">
        <div class="image-container1">
          <img src={serviceimg1} alt="Main Service" class="service-img1" />
          <img src={smallLogo1} alt="Logo 1" class="small-logo bottom-right" />
          <img src={smallLogo2} alt="Logo 2" class="small-logo left-side" />
        </div>

        <div class="services-text">
          <h3 class="main-title">ONE STOP SHOP FOR CARDS AND COLLECTIBLES.</h3>
          <p class="sub-title">
            From booster packs to rare finds, explore a massive selection of
            trading cards and accessories for every player and collector.
          </p>
          <button
            class="visit-store"
            onClick={() => window.open("https://store.yuranka.com", "_blank")}
          >
            Visit Our Webshop
          </button>
          <img src={smallLogo3} alt="Top-right Logo" class="top-right-logo" />
        </div>
      </div>

      <div class="service2-content">
        <div class="services2-text">
          <h3 class="main-title2">
            FROM CASUAL GAMES TO CHAMPIONSHIP MOMENTS.
          </h3>
          <p class="sub-title2">
            From beginner-friendly events to high-stakes competitions, enter our
            tournaments and go head-to-head with the best.
          </p>
          <button class="view-events" onClick={handleViewEvents}>
            View Events
          </button>
        </div>

        <div class="image-container2">
          <img src={serviceimg2} alt="Main Service" class="service-img2" />
          <img src={smallLogo4} alt="Logo 4" class="small-logo top-left" />
          <img src={smallLogo5} alt="Logo 5" class="small-logo bottom-left" />
        </div>
      </div>

      <div class="services3-content">
        <div class="image-container3">
          <img src={serviceimg3} alt="Main Service" class="service-img3" />
          <img src={smallLogo7} alt="Logo 1" class="seventhlogo" />
          <img src={smallLogo8} alt="Logo 2" class="eighthlogo" />
        </div>

        <div class="services3-text">
          <h3 class="main-title3">GAME NIGHTS MADE EASY.JUST BOOK AND PLAY.</h3>
          <p class="sub-title3">
            Whether it's casual play or intense matchups, reserve a table and
            make every game night memorable.
          </p>
          <button class="reserve-table" onClick={handleReserveTable}>
            Reserve A Table
          </button>
          <img src={smallLogo6} alt="Top-right Logo" class="sixthlogo" />
        </div>
      </div>
    </section>
  );
};

export default OurServices;
