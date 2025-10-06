import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./MiniCons.css";

export default function MiniCon() {
  const [activeTab, setActiveTab] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const miniCons = [
    {
      id: 1,
      name: "One Piece",
      logo: "https://ik.imagekit.io/mcgszbooe/one-piece-logo-67.png",
      background: "https://ik.imagekit.io/mcgszbooe/OnePIece.jpg",
      status: "done",
      content: {
        title: "One Piece Mini Con",
        date: "September 7th",
        mainEvents: [
          {
            time: "11:00 AM",
            title: "Find the Devil Fruit Treasure Hunt",
            description:
              "Embark on an exciting adventure to find hidden Devil Fruits across the venue and win a Dragon Fruit!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/devil%20fruit%20hunt.jpg",
          },
          {
            time: "3:00 PM",
            title: "Trivia Time",
            description:
              "Test your knowledge of One Piece lore in this thrilling quiz competition!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/trivia%20one%20piece.jpg",
          },
          {
            time: "6:00 PM",
            title: "Cosplay Competition",
            description:
              "Show off your best One Piece character cosplay and win amazing prizes! Get bragging rights and a gift card!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/Cosplay.jpg",
          },
          {
            time: "12:00 PM",
            title: "Anime Watch Club Panel Discussion",
            description:
              "Join fellow fans in discussing the latest One Piece episodes and theories!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/Anime%20watch%20Club.png",
          },
        ],
        sideEvents: [
          {
            title: "Artist Alley",
            image: "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/Artist.jpg",
          },
          {
            title: "Photo Booth",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/Photobooth.jpg",
          },
          {
            title: "Video Games",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/jumpforce.jpg",
          },
          {
            title: "Trading Card Games",
            image: "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/TCG.jpg",
          },
          {
            title: "Crafting Table",
            image:
              "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/Crafting.jpg",
          },
        ],
        info: {
          time: {
            start: "10:30 AM",
            end: "9:30 PM",
          },
          price: "5",
          cosplayCategories: [
            "Best Straw Hats Cosplay",
            "Best Male Cosplay",
            "Best Female Cosplay",
            "Best Group Cosplay",
          ],
          scavengerHuntPrizes: [
            "1st Place: Gomu Gomu Devil Fruit and Random Gacha Balls",
            "2nd Place: Mera Mera Devil Fruit and Random Gacha Balls",
            "3rd Place: Hana Hana Devil Fruit and Random Gacha Ball",
          ],
        },
        sponsors: [
          {
            name: "Anime Shop",
            logo: "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/AnimeShop%20Logo.png",
          },
          {
            name: "Anime Forum",
            logo: "https://ik.imagekit.io/mcgszbooe/Webpage%20Pics/animeforum.png",
          },
        ],
      },
    },
    {
      id: 2,
      name: "Wii Olympics",
      logo: "https://ik.imagekit.io/mcgszbooe/Wii%20Sports.svg",
      background: "https://ik.imagekit.io/mcgszbooe/wii%20sports.jpg",
      status: "done",
      content: {
        title: "Yuranka Wii Olympics Games",
        date: "December 21st, 2024",
        mainEvents: [
          {
            time: "12:00 PM - 1:00 PM",
            title: "Registration and Warm-Up",
            description:
              "Sign up for competitions and get some practice matches in to warm up!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Kick-off%20-%20wii%20sport.jpg",
          },
          {
            time: "1:00 PM - 2:30 PM",
            title: "Individual Competitions (Round 1)",
            description:
              "Bowling, Boxing, Tennis, and Baseball preliminary rounds",
            image:
              "https://ik.imagekit.io/mcgszbooe/Rounds%20-%20wii%20sport.jpg",
          },
          {
            time: "3:00 PM - 4:30 PM",
            title: "Individual Competitions (Finals)",
            description:
              "Championship matches and final showdowns in all sports categories!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Finale%20-%20wii%20sport.jpg",
          },
        ],
        info: {
          schedule: "12:00 PM - 6:00 PM",
          note: "Including awards ceremony and free play session",
          fee: "€2 per person",
          categories: [
            "Wii Bowling Challenge",
            "Boxing Face-Off",
            "Tennis Tournament",
            "Baseball Showdown",
          ],
          prizes: [
            "Gold Medal: Yuranka Wii Winter Games Gold Medal",
            "Silver Medal: Yuranka Wii Winter Games Silver Medal",
            "Bronze Medal: Yuranka Wii Winter Games Bronze Medal",
            "Top Team: Champion Trophy",
          ],
          pointSystem: [
            "1st Place: 10 points",
            "2nd Place: 7 points",
            "3rd Place: 5 points",
            "Participation: 2 points",
          ],
        },
      },
    },
    {
      id: 5,
      name: "Winter Olympics",
      logo: "https://ik.imagekit.io/mcgszbooe/Wii%20Sports.svg",
      background: "https://ik.imagekit.io/mcgszbooe/wii%20sports.jpg",
      status: "done",
      content: {
        title: "Yuranka Wii Olympics @ Wintercon",
        date: "January 18th, 2025",
        location: "Exhibition Center Kipsala, Riga, Latvia",
        mainEvents: [
          {
            time: "1:00 PM - 2:00 PM",
            title: "Registration and Warm-Up",
            description:
              "Sign up for winter competitions and get some practice runs in!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Kick-off%20-%20wii%20sport.jpg",
          },
          {
            time: "2:00 PM - 3:30 PM",
            title: "Individual Competitions (Round 1)",
            description:
              "Skiing, Ice Skating, Curling, and Snowboarding preliminary rounds",
            image:
              "https://ik.imagekit.io/mcgszbooe/Rounds%20-%20wii%20sport.jpg",
          },
          {
            time: "4:00 PM - 5:30 PM",
            title: "Individual Competitions (Finals)",
            description:
              "Championship matches and final showdowns in all winter sports categories!",
            image:
              "https://ik.imagekit.io/mcgszbooe/Finale%20-%20wii%20sport.jpg",
          },
        ],
        info: {
          schedule: "1:00 PM - 7:00 PM",
          note: "Including awards ceremony and free play session",
          entryFee: ["Individual Entry: €5", "Team Entry: €17"],
          location: ["Exhibition Center Kipsala", "Riga, Latvia"],
          categories: [
            "Alpine Skiing Challenge",
            "Figure Skating Competition",
            "Curling Tournament",
            "Snowboard Cross",
          ],
          prizes: [
            "Gold Medal: Yuranka Winter Games Gold Medal",
            "Silver Medal: Yuranka Winter Games Silver Medal",
            "Bronze Medal: Yuranka Winter Games Bronze Medal",
            "Top Team: Winter Champion Trophy",
          ],
          pointSystem: [
            "1st Place: 10 points",
            "2nd Place: 7 points",
            "3rd Place: 5 points",
            "Participation: 2 points",
          ],
        },
      },
    },
    {
      id: 4,
      name: "Disney",
      logo: "https://ik.imagekit.io/mcgszbooe/Disney.png",
      background: "",
      status: "upcoming",
      content: {
        title: "Disney Mini Con",
        date: "Coming Soon!",
      },
    },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    setActiveTab(null);
  };

  const nextSlide = () => {
    if (activeTab?.content?.sideEvents) {
      setCurrentSlide(
        (prev) => (prev + 1) % activeTab.content.sideEvents.length
      );
    }
  };

  const prevSlide = () => {
    if (activeTab?.content?.sideEvents) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + activeTab.content.sideEvents.length) %
          activeTab.content.sideEvents.length
      );
    }
  };

  const renderTabContent = () => {
    if (!activeTab) return null;

    const eventBackgroundStyle = {
      backgroundImage: `url('${activeTab.background}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    return (
      <div className="minicons-modal-overlay" style={eventBackgroundStyle}>
        <div className="event-container">
          <button onClick={handleBackClick} className="back-button">
            <ChevronLeft className="back-icon" />
          </button>

          {/* Event Header */}
          <div className="event-header">
            <h2 className="minicon-event-title">{activeTab.content.title}</h2>
            <p className="minicon-event-date">{activeTab.content.date}</p>
            {activeTab.content.location && (
              <p className="event-location">{activeTab.content.location}</p>
            )}

            {activeTab.id === 1 && (
              <div className="registration-buttons">
                <button disabled className="registration-button">
                  Click here to sign up
                </button>
                <button disabled className="registration-button">
                  Artist Registration
                </button>
              </div>
            )}

            {activeTab.id === 2 && (
              <div className="registration-buttons">
                <button disabled className="registration-button">
                  Sign up as individual (2 euros)
                </button>
                <button disabled className="registration-button">
                  Sign up as team (6 euros)
                </button>
              </div>
            )}

            {activeTab.id === 5 && (
              <div className="registration-buttons">
                <button disabled className="registration-button">
                  Sign up as individual (5 euros)
                </button>
                <button disabled className="registration-button">
                  Sign up as team (17 euros)
                </button>
              </div>
            )}
          </div>

          {/* Main Events */}
          {activeTab.content.mainEvents && (
            <div className="main-events-container">
              <div className="main-events-grid">
                {activeTab.content.mainEvents.map((event, index) => (
                  <div key={index} className="minicon-event-card">
                    <div
                      className="minicon-event-card-image"
                      style={{ backgroundImage: `url('${event.image}')` }}
                    ></div>
                    <div className="minicon-event-card-content">
                      <h3 className="minicon-event-card-time">{event.time}</h3>
                      <p className="minicon-event-card-title">{event.title}</p>
                      <p className="minicon-event-card-description">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side Events Carousel */}
          {activeTab.content.sideEvents && (
            <div className="side-events-container">
              <h3 className="side-events-title">All Day Events</h3>
              <div className="carousel-container">
                <div className="carousel-slide">
                  {activeTab.content.sideEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === currentSlide ? "active" : ""
                      }`}
                    >
                      <div
                        className="carousel-image"
                        style={{ backgroundImage: `url('${event.image}')` }}
                      ></div>
                      <p className="carousel-title">{event.title}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={prevSlide}
                  className="carousel-button prev-button"
                >
                  <ChevronLeft className="prev-button-icon" />
                </button>
                <button
                  onClick={nextSlide}
                  className="carousel-button next-button"
                >
                  <ChevronRight className="next-button-icon" />
                </button>
              </div>
            </div>
          )}

          {/* Event Info */}
          {activeTab.content.info && (
            <div className="event-info-container">
              <div className="event-info-content">
                <h3 className="event-info-title">
                  {activeTab.id === 1
                    ? "One Piece Mini-Con Details"
                    : activeTab.id === 2
                    ? "Event Details"
                    : "Event Details"}
                </h3>

                <div className="event-info-grid">
                  {/* Time/Schedule */}
                  <div className="info-card">
                    <h4 className="info-card-title">
                      {activeTab.content.info.time
                        ? "Event Time"
                        : "Event Schedule"}
                    </h4>
                    {activeTab.content.info.time ? (
                      <div>
                        <p>
                          Starting Time: {activeTab.content.info.time.start}
                        </p>
                        <p>End Time: {activeTab.content.info.time.end}</p>
                      </div>
                    ) : (
                      <div>
                        <p>{activeTab.content.info.schedule}</p>
                        {activeTab.content.info.note && (
                          <p>{activeTab.content.info.note}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price/Fee */}
                  <div className="info-card">
                    <h4 className="info-card-title">
                      {activeTab.content.info.price
                        ? "Entry Price"
                        : "Entry Fee"}
                    </h4>
                    {activeTab.content.info.price ? (
                      <p>€{activeTab.content.info.price}</p>
                    ) : activeTab.content.info.fee ? (
                      <p>{activeTab.content.info.fee}</p>
                    ) : (
                      <ul className="info-list">
                        {activeTab.content.info.entryFee.map((fee, index) => (
                          <li key={index}>{fee}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Location if available */}
                  {activeTab.content.info.location && (
                    <div className="info-card">
                      <h4 className="info-card-title">Location</h4>
                      {activeTab.content.info.location.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}

                  {/* Categories */}
                  {(activeTab.content.info.cosplayCategories ||
                    activeTab.content.info.categories) && (
                    <div className="info-card">
                      <h4 className="info-card-title">
                        {activeTab.content.info.cosplayCategories
                          ? "Cosplay Categories (participants get free entry)"
                          : `${
                              activeTab.id === 5 ? "Winter " : ""
                            }Sports Categories`}
                      </h4>
                      <ul className="info-list">
                        {(
                          activeTab.content.info.cosplayCategories ||
                          activeTab.content.info.categories
                        ).map((category, index) => (
                          <li key={index}>{category}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prizes */}
                  {(activeTab.content.info.scavengerHuntPrizes ||
                    activeTab.content.info.prizes) && (
                    <div className="info-card">
                      <h4 className="info-card-title">
                        {activeTab.content.info.scavengerHuntPrizes
                          ? "Scavenger Hunt Prizes"
                          : "Prizes"}
                      </h4>
                      <ul className="info-list">
                        {(
                          activeTab.content.info.scavengerHuntPrizes ||
                          activeTab.content.info.prizes
                        ).map((prize, index) => (
                          <li key={index}>{prize}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Point System if available */}
                  {activeTab.content.info.pointSystem && (
                    <div className="info-card">
                      <h4 className="info-card-title">Team Points System</h4>
                      <ul className="info-list">
                        {activeTab.content.info.pointSystem.map(
                          (point, index) => (
                            <li key={index}>{point}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sponsors */}
          {activeTab.content.sponsors &&
            activeTab.content.sponsors.length > 0 && (
              <div className="sponsors-container">
                <div className="sponsors-grid">
                  {activeTab.content.sponsors.map((sponsor, index) => (
                    <div key={index} className="sponsor-item">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="sponsor-logo"
                      />
                      <p className="sponsor-name">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="minicon-wrapper">
      {!activeTab && (
        <div className="minicon-container">
          <img
            src="https://ik.imagekit.io/mcgszbooe/Logo"
            alt="Yuranka Games Logo"
            className="yuranka-logo"
          />
          <h2 className="minicon-subtitle">Yuranka Games proudly presents:</h2>
          <h1 className="minicon-title">Mini-Cons</h1>

          <div className="minicon-tabs">
            {miniCons.map((con) => (
              <div key={con.id} className="minicon-tab">
                <div
                  className={`minicon-tab-icon ${
                    con.status === "done" ? "done" : ""
                  }`}
                  style={{ backgroundImage: `url(${con.logo})` }}
                  onClick={() => handleTabClick(con)}
                >
                  {con.status === "done" && (
                    <div className="status-overlay">DONE</div>
                  )}
                </div>
                <img
                  src={con.logo}
                  alt={`${con.name} Logo`}
                  className="minicon-tab-logo"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {renderTabContent()}
    </div>
  );
}
