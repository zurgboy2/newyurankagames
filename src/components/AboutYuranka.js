import React from "react";
import "./AboutYuranka.css";
import storeImage from "../assets/store.jpg";
import visionImage from "../assets/vision.png";
import missionIcon1 from "../assets/missionIcon1.png";
import missionIcon2 from "../assets/missionIcon2.png";
import missionIcon3 from "../assets/missionIcon3.png";

const AboutYuranka = () => {
  return (
    <div className="about-yuranka-container">
      {/* First Section: About and Our Store */}
      <h1 className="about-yuranka-heading">About Yuranka Games</h1>

      <h2 className="sub-heading">Our Store</h2>
      <div className="about-yuranka-store">
        <div className="text-block">
          <p className="about-yuranka-store-paragraph">
            Yuranka Games is more than just a store; it's a passion project born
            from our love for Trading Card Games (TCGs) and a deep-rooted
            nostalgia for the days when children had "third places" to engage in
            non-sports related activities. What began as a haven for TCG
            enthusiasts has blossomed into a diverse gaming paradise. Today, we
            proudly offer a wide array of entertainment options, including board
            games, video games, and tabletop gaming, along with exciting events
            for all ages. At Yuranka Games, we're not just selling games; we're
            cultivating a community and keeping the spirit of play alive for
            generations to come.
          </p>
        </div>
        <div className="image-block">
          <img src={storeImage} alt="Our Store" />
        </div>
      </div>

      {/* Second Section: Our Vision */}
      <h2 className="sub-heading-vision">Our Vision</h2>
      <div className="about-vision-section">
        <div className="vision-image-block">
          <img src={visionImage} alt="Our Vision" />
        </div>
        <div className="vision-text-block">
          <p className="vision-paragraph">
            At Yuranka Games, we envision a future where gaming brings people
            together, fostering connections and creating lasting memories. We
            see ourselves as pioneers in the Latvian gaming landscape, expanding
            beyond our current location to bring the joy of TCGs and other
            gaming experiences to communities across multiple counties. Our
            vision is to establish Yuranka Games as the premier destination for
            gaming enthusiasts of all kinds, creating a network of welcoming
            spaces where passion for games is celebrated and new friendships are
            forged.
          </p>
        </div>
      </div>
      <div className="our-mission-section">
        <h2 className="mission-subheading">Our Mission</h2>
        <p className="mission-intro">
          Our mission at Yuranka Games is threefold,
        </p>

        <div className="mission-columns">
          <div className="mission-column">
            <div className="mission-icon">
              <img src={missionIcon1} alt="Our Vision" />
            </div>
            <p className="mission-paragraph">
              To provide a diverse and inclusive gaming environment that caters
              to enthusiasts of all ages and interests, from TCG aficionados to
              board game lovers and video game players.
            </p>
          </div>
          <div className="mission-column">
            <div className="mission-icon-flag">
              <img src={missionIcon2} alt="Our Vision" />
            </div>
            <p className="mission-paragraph">
              To expand our reach across Latvia, bringing the excitement of TCGs
              and other gaming experiences to new communities and helping to
              establish gaming as a mainstream hobby.{" "}
            </p>
          </div>
          <div className="mission-column">
            <div className="mission-icon">
              <img src={missionIcon3} alt="Our Vision" />
            </div>
            <p className="mission-paragraph">
              To foster a sense of community and belonging, creating a "third
              place" where people can come together, share their passions, and
              create lasting memories through the power of play.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutYuranka;
