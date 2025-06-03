import { makeRegistrationRequestCall, makeRequestCall } from "../api/api";
import React, {useState, useEffect,useRef} from "react";
import './Events.css';
import moment from 'moment';
import noposter from "../assets/noposter.png";
import { useLocation,useNavigate  } from "react-router-dom";
import EventsCalendar from './EventsCalendar';

const  EventsSection= ()=>{

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const detailsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedWeeklyFilter, setSelectedWeeklyFilter] = useState('all');
  const [showAllWeekly, setShowAllWeekly] = useState(false);
  const weeklyTournamentsRef = useRef(null);
  const [selectedMonthlyFilter, setSelectedMonthlyFilter] = useState('all');
  const [showAllMonthly, setShowAllMonthly] = useState(false);
  const monthlyTournamentsRef = useRef(null);

useEffect(() => {
  makeRequestCall('tournament_script', 'getActiveTournaments')
    .then((tournamentData) => {
      const tournamentsArray = JSON.parse(tournamentData.result);
      console.log(tournamentsArray);
      setTournaments(tournamentsArray);
      setLoading(false);

    })
    .catch((error) => {
      console.error("Error loading tournaments:", error);
      alert("Error loading tournaments for next month. Please try again.");
      setLoading(false);

    });
}, []);

useEffect(() => {
  if (selectedTournament && detailsRef.current) {
    // Allow a slight delay to ensure the details section has rendered with proper height
    setTimeout(() => {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}, [selectedTournament]);

const location = useLocation();

useEffect(() => {
  
  if (location.state?.tournament) {
    
    setSelectedTournament(location.state.tournament);    

    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    navigate(location.pathname, { replace: true });
  }
}, [location.state, navigate]);

useEffect(() => {
  if((location.state?.tournament)){
    window.scrollTo(0, 0); // Scrolls to the top on component mount
  }
}, [tournaments,location.state]);

const handleEventClick = (tournament) => {
  setSelectedTournament(tournament);
  if (detailsRef.current) {
    detailsRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

    const filters = [
      { label: 'All', key: 'all' },
      { label: 'Yu-Gi-Oh', key: 'yu-gi-oh' },
      { label: 'Flesh and Blood', key: 'flesh-and-blood' },
      { label: 'Magic the Gathering', key: 'magic-the-gathering' },
      { label: 'One-Piece', key: 'one-piece' },
      { label: 'Star Wars', key: 'star-wars' },
      { label: 'Pokemon', key: 'pokemon' },
      { label: 'Digimon', key: 'digimon' },
      { label: 'Video Game', key: 'video-game' },
      { label: 'Board Game', key: 'board-game' },
    ];

    // --- One-Time Events ---
  const oneTimeEvents = tournaments.filter(t => t.eventFrequencyType === 'oneTime');

  // --- Weekly Events ---
  const weeklyEvents = tournaments.filter(t => t.eventFrequencyType === 'weekly');
  const weeklyEventCounts = filters.reduce((acc, filter) => {
    if (filter.key === 'all') {
      acc[filter.key] = weeklyEvents.length;
    } else {
      acc[filter.key] = weeklyEvents.filter(t => t.eventType === filter.key).length;
    }
    return acc;
  }, {});
  const filteredWeeklyEvents = weeklyEvents.filter(t => {
    if (selectedWeeklyFilter === 'all') return true;
    return t.eventType === selectedWeeklyFilter;
  });
  useEffect(() => { setShowAllWeekly(false); }, [selectedWeeklyFilter, tournaments]);
  const displayedWeeklyEvents = showAllWeekly ? filteredWeeklyEvents : filteredWeeklyEvents.slice(0, 8);

  // --- Monthly Events ---
  const monthlyEvents = tournaments.filter(t => t.eventFrequencyType === 'monthly');
  const monthlyEventCounts = filters.reduce((acc, filter) => {
    if (filter.key === 'all') {
      acc[filter.key] = monthlyEvents.length;
    } else {
      acc[filter.key] = monthlyEvents.filter(t => t.eventType === filter.key).length;
    }
    return acc;
  }, {});
  const filteredMonthlyEvents = monthlyEvents.filter(t => {
    if (selectedMonthlyFilter === 'all') return true;
    return t.eventType === selectedMonthlyFilter;
  });
  useEffect(() => { setShowAllMonthly(false); }, [selectedMonthlyFilter, tournaments]);
  const displayedMonthlyEvents = showAllMonthly ? filteredMonthlyEvents : filteredMonthlyEvents.slice(0, 8);

   
return (
  <div className="events-container"> 
  <EventsCalendar 
            tournaments={tournaments} 
            onEventClick={handleEventClick}
          />
          
    <h1 className="events-title">Upcoming Tournaments & Events</h1>
    
    {/* One-Time Events Section */}
    <h2 className="events-subtitle">One-Time Events</h2>
    {loading ? (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Events & Tournaments...</p>
      </div>
    ) : (
      <div className="tournament-cards-container">
         {oneTimeEvents.map((tournament, index) => (
            <div key={index} className="tournament-card">
              <div className="card-image">
                <img src={tournament.posterUrl||noposter} alt={tournament.name} />
              </div>
              <h3 className="card-title">{tournament.name}</h3>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-readerinfo">{tournament.description || ""}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Date:</span> 
                  <span className="detail-value">
                    {tournament.date ? moment(tournament.date).format("MMMM Do dddd") : "To be informed"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span> 
                  <span className="detail-value">{formatTime(tournament.date)|| "To be informed"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Entrance fee:</span> 
                  <span className="detail-value">{tournament.price + " EUR" || "To be informed"}</span>
                </div>
                {tournament.prizes && (
                  <div className="detail-item">
                    <span className="label">Prizes: </span> 
                    <span className="detail-readerinfo">
                      {tournament.prizes}
                    </span>
                  </div>
                )}
                {tournament.preReleaseBundleIncludes && (
                  <div className="detail-item">
                    <span className="label">Pre-Release Bundle Includes: </span> 
                    <span className="detail-readerinfo">
                      {tournament.preReleaseBundleIncludes}
                    </span>
                  </div>
                )}
                {tournament.rules && (
                  <div className="detail-item">
                    <span className="label">Rules: </span> 
                    <span className="detail-readerinfo">
                      {tournament.rules}
                    </span>
                  </div>
                )}
              </div>
              <button className="register-button" onClick={() => {
                setSelectedTournament(tournament);
              }}>Register</button>
            </div>
          ))}
      </div>
    )}

      {/* --- Monthly Events Section --- */}
      <h2 className="events-subtitle" ref={monthlyTournamentsRef}>Monthly Events</h2>
      <div className="filters-container">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-button ${selectedMonthlyFilter === filter.key ? 'active' : ''}`}
            onClick={() => setSelectedMonthlyFilter(filter.key)}
          >
            {filter.label} ({monthlyEventCounts[filter.key]})
          </button>
        ))}
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Monthly Events & Tournaments...</p>
        </div>
      ) : (
        <>
          <div className="tournament-cards-container">
            {displayedMonthlyEvents.length === 0 && <p>No monthly events for selected filter.</p>}
            {displayedMonthlyEvents.map((tournament, index) => (
              <div key={index} className="tournament-card">
                <div className="card-image">
                  <img src={tournament.posterUrl || noposter} alt={tournament.name} />
                </div>
                <h3 className="card-title">{tournament.name}</h3>
                <div className="card-details">
                  <div className="card-details-scroll" dangerouslySetInnerHTML={{ __html: tournament.descriptionHtml }} />
                  <div className="detail-item">
                    <span className="detail-readerinfo">{tournament.description || ""}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="detail-value">
                      {tournament.date ? moment(tournament.date).format("MMMM Do dddd") : "To be informed"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time:</span>
                    <span className="detail-value">{formatTime(tournament.date) || "To be informed"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Entrance fee:</span>
                    <span className="detail-value">{tournament.price + " EUR" || "To be informed"}</span>
                  </div>
                  {tournament.prizes && (
                    <div className="detail-item">
                      <span className="label">Prizes: </span>
                      <span className="detail-readerinfo">{tournament.prizes}</span>
                    </div>
                  )}
                  {tournament.preReleaseBundleIncludes && (
                    <div className="detail-item">
                      <span className="label">Pre-Release Bundle Includes: </span>
                      <span className="detail-readerinfo">{tournament.preReleaseBundleIncludes}</span>
                    </div>
                  )}
                  {tournament.rules && (
                    <div className="detail-item">
                      <span className="label">Rules: </span>
                      <span className="detail-readerinfo">{tournament.rules}</span>
                    </div>
                  )}
                </div>
                <button className="register-button" onClick={() => setSelectedTournament(tournament)}>Register</button>
              </div>
            ))}
          </div>
          {filteredMonthlyEvents.length > 8 && (
            <div className="event-view-all-button-container desktop-only">
              <button
                className="event-view-all-btn"
                onClick={() => {
                  const newState = !showAllMonthly;
                  setShowAllMonthly(newState);
                  if (!newState && monthlyTournamentsRef.current) {
                    monthlyTournamentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                      window.scrollBy(0, -100);
                    }, 650);
                  }
                }}
              >
                {showAllMonthly ? "View Less" : "View All"}
              </button>
            </div>
          )}
        </>
      )}
      
    {/* Weekly Events Section */}
    <h2 className="events-subtitle" ref={weeklyTournamentsRef}>Weekly Events</h2>

    <div className="filters-container">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-button ${selectedWeeklyFilter === filter.key ? 'active' : ''}`}
            onClick={() => setSelectedWeeklyFilter(filter.key)}
          >
            {filter.label} ({weeklyEventCounts[filter.key]})
          </button>
        ))}
      </div>

    {loading ? (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Weekly Events & Tournaments...</p>
      </div>
    ) : (
      <>
      <div className="tournament-cards-container">
        {displayedWeeklyEvents.map((tournament, index) => (
            <div key={index} className="tournament-card">
              <div className="card-image">
              <img src={tournament.posterUrl||noposter} alt={tournament.name} />
              </div>
              <h3 className="card-title">{tournament.name}</h3>
              <div className="card-details">
                <div className="card-details-scroll" dangerouslySetInnerHTML={{ __html: tournament.descriptionHtml }} />
                <div className="detail-item">
                  <span className="detail-readerinfo">{tournament.description || ""}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Date:</span> 
                  <span className="detail-value">
                    {tournament.date ? moment(tournament.date).format("MMMM Do dddd") : "To be informed"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span> 
                  <span className="detail-value">{formatTime(tournament.date) || "To be informed"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Entrance fee:</span> 
                  <span className="detail-value">{tournament.price + " EUR" || "To be informed"}</span>
                </div>
                {tournament.prizes && (
                  <div className="detail-item">
                    <span className="label">Prizes: </span> 
                    <span className="detail-readerinfo">
                      {tournament.prizes}
                    </span>
                  </div>
                )}
                {tournament.preReleaseBundleIncludes && (
                  <div className="detail-item">
                    <span className="label">Pre-Release Bundle Includes: </span> 
                    <span className="detail-readerinfo">
                      {tournament.preReleaseBundleIncludes}
                    </span>
                  </div>
                )}
                {tournament.rules && (
                  <div className="detail-item">
                    <span className="detail-readerinfo">
                    <span className="label">Rules: </span> 
                      {tournament.rules}
                    </span>
                  </div>
                )}
              </div>
              <button className="register-button" onClick={() => {
                setSelectedTournament(tournament);
              }}>Register</button>
            </div>
          ))}
          
      </div>
      {filteredWeeklyEvents.length > 8 && (
           <div className="event-view-all-button-container desktop-only">
              <button
              className="event-view-all-btn"
                onClick={() => {
              const newState = !showAllWeekly;
              setShowAllWeekly(newState);
              if (!newState && weeklyTournamentsRef.current) {
              weeklyTournamentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(() => {
                  window.scrollBy(0, -100); 
                }, 650);            }
            }}
            >
              {showAllWeekly ? "View Less" : "View All"}
            </button>
           </div>
           
          )}
          </>
         )
       }
  
  <div ref={detailsRef}>
  <TournamentDetailsSection tournament={selectedTournament} />

  </div>
  </div>
);
}


const TournamentDetailsSection = ({ tournament }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const storedName = sessionStorage.getItem("name") || "";
    setName(storedName);
  }, []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || "";
    setEmail(storedEmail);
  }, []);

  async function handleRegistration(e) {
    e.preventDefault();

  if (!name.trim() || !email.trim()) {
    alert("Please fill in all required fields.");
    return;
  }
    setIsLoading(true);

    const username = sessionStorage.getItem('username') || '';
    const googleToken = sessionStorage.getItem("googleToken") || "";

    try {
      const result = await makeRegistrationRequestCall('tournament_script','registerForEvent', {
        eventId: tournament.id,
        name: name,
        email: email,
        username: username, // Using name as the username (adjust if needed)
        googleToken: googleToken,
      });

      setResult(result);
      setErrorMessage(""); // Clear any previous error
      setShowPopup(true);

    } catch (error) {

      setResult(null);
      setErrorMessage("An error occurred while processing your registration. Please try again later.");
      setShowPopup(true);
    }
    finally{
      setIsLoading(false); 
    }
  }
  
  if (!tournament) {
    return (
      <div className="tournament-details-section">
        <p>Select an event to register.</p>
      </div>
    );
  }
  return (
    <div className="tournament-details-section">
      <p>Register Now!</p>
      <div className="details-top">
        {/* Left Column: Image Box */}
        <div className="image-box">
          <img src={tournament.posterUrl|| noposter} alt={tournament.name} className="tournament-image" />
        </div>
        {/* Right Column: Tournament Details */}
        <div className="details-column">
          <div className="detail-row">
            <span className="detail-label">Event:</span>
            <span className="detail-val">{tournament.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
           <span className="detail-val">{tournament.date 
        ? moment(tournament.date).format("MMMM Do dddd")
        : "To be informed"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-val">{formatTime(tournament.date)||"To be informed. Stay tuned!"}</span>
          </div>
    
           {tournament.description && (
            <div className="detail-row">
            <span className="detail-label-bundle">Description:</span>
            <span className="detail-value-bundle">{tournament.description}</span>
          </div> 
        )}
          {tournament.preReleaseBundleIncludes && (
            <div className="detail-row">
            <span className="detail-label-bundle">Pre-Release Bundle Includes:</span>
            <span className="detail-value-bundle">{tournament.preReleaseBundleIncludes}</span>
          </div>
        )}
          {tournament.prizes &&(
            <div className="detail-row">
            <span className="detail-label">Prizes:</span>
            <span className="detail-value-prizes">{tournament.prizes}</span>
          </div>
          )}          
          {tournament.rules && (
            <div className="detail-row">
            <span className="detail-label">Rules:</span>
            <span className="detail-value-rules">
            {tournament.rules}
            </span>
          </div>
          )}          
          {tournament.price && (
            <div className="detail-row">
            <span className="detail-label">Entrance Fee:</span>
            <span className="detail-val">{tournament.price||"To be informed. Stay tuned!"} EUR</span>
          </div>
          )}          
        </div>
      </div>
      {/* Registration Form: Name and Email */}
      <form className="registration-form" id="registrationForm"  onSubmit={handleRegistration}>
        <div className="form-group">
          <label htmlFor="participant-name">Name</label>
          <input type="text" id="participant-name" placeholder="Enter your name" value={name}
          onChange={(e) => setName(e.target.value)}required/>
        </div>
        <div className="form-group">
          <label htmlFor="participant-email">Email</label>
          <input type="email" id="participant-email" placeholder="Enter your email" value={email}
          onChange={(e) => setEmail(e.target.value)} required/>
        </div>
      </form>
      {/* Disclaimer */}
      <div className="disclaimer-section">
        <div className="disclaimer-heading" ><h3 >Disclaimer</h3>
        </div>
        </div>    
          <div  className="disclaimer-text">
          Your personal information is collected solely for the purpose of tournament
          organization and communication. All data will be securely stored and deleted
          within 30 days after the tournament's conclusion.
          </div>
          <div  className="disclaimer-text">
          For your convenience, secure online payment options are available. 
          Follow the provided checkout link to pay by card, or choose to pay in person at our store by cash.
          </div>
          <div className="disclaimer-text">
          Ticket Purchase Policy: Tickets are non-refundable. If you cannot attend the registered tournament, 
          your ticket will be valid for the next event in the series. Should you miss all events, collect your boosters the following business day at our store. 
          </div>
 
      <button className="proceed-button" onClick={handleRegistration} >Register</button>
      {isLoading && <p className="loading-message">Checking availability...</p>} 

      {showPopup && <ConfirmationPopup result={result} errorMessage={errorMessage} onClose={() => setShowPopup(false)} />}

    </div>
  );
};


const ConfirmationPopup = ({ result, errorMessage, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <>
            <p className="modal-message">
            {result?.checkoutUrl ? (
            "You registration is reserved. Please proceed to checkout to confirm your spot. Your spot is only confirmed once payment is made."
              ) : result?.message ===
            "Unfortunately, the event is full. Your registration could not be completed. Please check back later or contact support." ? (
            result.message
            ) : (
            "Your registration is confirmed and no payment is required. Enjoy the event!"
            )}
            </p>
            {result?.checkoutUrl && (
              <a href={result.checkoutUrl} target="_blank" rel="noopener noreferrer" className="checkout-btn">
                Proceed to Checkout
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};



 export default EventsSection; 

 const formatTime = (isoDate) => {
  if (!isoDate) return null;
  
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null; // Check for invalid dates

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

 