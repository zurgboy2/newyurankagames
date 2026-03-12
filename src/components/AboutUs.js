import "./AboutUs.css";
import aboutUs1 from "../assets/aboutUs1.avif";
import aboutUs2 from "../assets/aboutUs2.avif";
import aboutUs3 from "../assets/aboutUs3.avif";
import aboutUs4 from "../assets/aboutUs4.avif";
import aboutUs5 from "../assets/aboutUs5.avif";
import aboutUs6 from "../assets/aboutUs6.avif";
import aboutUs7 from "../assets/aboutUs7.avif";
import aboutUs8 from "../assets/aboutUs8.avif";

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
