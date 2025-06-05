import { makeRequestCall } from "../api/api";
import React, {useState, useEffect,useRef} from "react";
import noposter from "../assets/noposter.png";
import moment from 'moment';
import './EventsLanding.css';
import { useNavigate } from "react-router-dom";

const EventsLandingPageSection =() =>{
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
      makeRequestCall('tournament_script', 'getActiveTournaments')
        .then((tournamentData) => {
          const tournamentsArray = JSON.parse(tournamentData.result);
          setTournaments(tournamentsArray);
          setLoading(false);
          
        })
        .catch((error) => {
          console.error("Error loading tournaments:", error);
          setLoading(false);

        });
    }, []);

    const navigate = useNavigate();

  const handleViewDetails = (tournament) => {
    navigate("/events", { state: { tournament } });
  };
 
    return(<div className="horizontal-events-section">
        <h2 className="section-title">Upcoming Events</h2>
        {
            loading?(
                <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading events...</p>
              </div>
            ):(
                <div className="cards-container">
                {tournaments.map((tournament, index) => (
                  <div key={index} className="event-card">
                   
                   <span className="registration-badge">Registration Open</span>
                    <div className="card-poster">
                      <img src={tournament.posterUrl || noposter} alt={tournament.name} />
                    </div>
                    <h3 className="event-name">{tournament.name}</h3>
                    <div className="event-date">{moment(tournament.date).format("MMMM Do")}</div>
                    <button className="view-details-button" onClick={()=>handleViewDetails(tournament)} >View Details</button>
                  </div>
                ))}
              </div>
            )
        }
       

      </div>)
}

 export default EventsLandingPageSection;