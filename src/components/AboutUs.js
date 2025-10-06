import "./AboutUs.css";
import aboutUs1 from "../assets/aboutUs1.jpg";
import aboutUs2 from "../assets/aboutUs2.jpg";
import aboutUs3 from "../assets/aboutUs3.jpg";
import aboutUs4 from "../assets/aboutUs4.jpg";
import aboutUs5 from "../assets/aboutUs5.jpg";
import aboutUs6 from "../assets/aboutUs6.jpg";
import aboutUs7 from "../assets/aboutUs7.jpg";
import aboutUs8 from "../assets/aboutUs8.jpg";

const AboutUs = () => {
  return (
    <section className="about-us">
      <h2 className="about-heading">About Us</h2>
      <div className="about-text-container">
        <p className="about-text">
          at <span className="highlight">Yuranka Games</span> we’re more than
          just a game store—we’re a community. From rare cards to thrilling
          tournaments, we’re here to fuel your passion.
        </p>
      </div>
      <div className="image-gallery">
        <img src={aboutUs1} alt="AboutUs" className="about-img" />
        <img src={aboutUs2} alt="AboutUs" className="about-img" />
        <img src={aboutUs3} alt="AboutUs" className="about-img" />
        <img src={aboutUs4} alt="AboutUs" className="about-img" />
        <img src={aboutUs5} alt="AboutUs" className="about-img" />
        <img src={aboutUs6} alt="AboutUs" className="about-img" />
        <img src={aboutUs7} alt="AboutUs" className="about-img" />
        <img src={aboutUs8} alt="AboutUs" className="about-img" />
      </div>
    </section>
  );
};

export default AboutUs;
