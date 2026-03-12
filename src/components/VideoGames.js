import { useEffect, useState } from "react";
import { makeVideoGamesRequestCall } from "../api/api";
import "./VideoGames.css";
import noposter from "../assets/noposter.avif";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VideoGamesSection = () => {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Games");
  const [gamesByConsole, setGamesByConsole] = useState({});
  const [visibleCount, setVisibleCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevVisibleCount, setPrevVisibleCount] = useState({});

  const navigate = useNavigate();

  const handleReserveGame = () => {
    navigate("/reservations");
  };

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await makeVideoGamesRequestCall(
          "videogames_script",
          "search_games",
          {}
        );
        if (response.success && response.games) {
          setGames(response.games);
          setFilters(["All Games", ...response.filters]);
          organizeGames(response.games);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  function organizeGames(games) {
    const groupedGames = {};
    games.forEach((game) => {
      if (!groupedGames[game.console]) {
        groupedGames[game.console] = [];
      }
      groupedGames[game.console].push(game);
    });
    const initialCount = window.innerWidth <= 768 ? 4 : 7;

    setGamesByConsole(groupedGames);
    setVisibleCount(
      Object.keys(groupedGames).reduce(
        (acc, key) => ({ ...acc, [key]: initialCount }),
        {}
      )
    );
  }

  function handleSearchChange(e) {
    setActiveFilter("All Games");
    setSearchQuery(e.target.value);
  }

  function filterGames(gameList) {
    if (!searchQuery.trim()) return gameList;
    return gameList.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function handleFilterClick(filter) {
    setActiveFilter(filter);
  }

  function toggleGameDisplay(consoleType, totalGames) {
    setPrevVisibleCount((prev) => ({
      ...prev,
      [consoleType]: visibleCount[consoleType] || 0,
    }));

    setVisibleCount((prev) => {
      const isMobile = window.innerWidth <= 768; 
      const increment = isMobile ? 4 : 10; 
      const initialCount = isMobile ? 4 : 7;

      const currentCount = prev[consoleType];
      const newCount = currentCount + increment;

      if (currentCount >= totalGames) {
        return { ...prev, [consoleType]: initialCount };
      }

      return { ...prev, [consoleType]: Math.min(newCount, totalGames) };
    });
  }

  return (
    <div className="video-games-section">
      {loading && (
        <div className="loading-screen">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading games...</p>
          </div>
        </div>
      )}
      {!loading && (
        <>
          <h1 className="video-games-title">Video Games</h1>
          <div className="video-games-header">
            <p className="video-games-subtitle">
              Browse our wide range of games and reserve a Couch Space to play.
              Each couch space can accommodate upto 6 people.
            </p>
            <button
              className="videogames-reserve-button"
              onClick={handleReserveGame}
            >
              Reserve Couch Space
            </button>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search for a game..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="search-icon">
                <FaSearch />
              </div>
            </div>
          </div>
          <h2 className="video-games-filter">Filters</h2>

          <div className="filters">
            {filters.map((filter) => (
              <button
                className="filter-button"
                key={filter}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="games-container">
            {activeFilter === "All Games" ? (
              Object.entries(gamesByConsole).map(([consoleType, games]) => {
                const filteredGames = filterGames(games);
                return (
                  <div key={consoleType} className="console-section">
                    <h3>{consoleType}</h3>
                    <div className="games-grid">
                      {filteredGames
                        .slice(0, visibleCount[consoleType])
                        .map((game) => (
                          <div key={game.id} className="game-card">
                            <img
                              src={
                                game.imageUrl === "No Image"
                                  ? noposter
                                  : game.imageUrl
                              }
                              alt="Game poster"
                            />
                            <h4>{game.name}</h4>
                            <div className="game-info">
                              <p>{game.console}</p>
                              <p>{game.spMp}</p>
                              <p>{game.yearOfPublish}</p>
                              <p>Players: {game.playerCount}</p>
                            </div>{" "}
                          </div>
                        ))}
                    </div>
                    {games.length > 4 && window.innerWidth <= 768 && (
                      <button
                        className="display-button"
                        onClick={() =>
                          toggleGameDisplay(consoleType, games.length)
                        }
                      >
                        {visibleCount[consoleType] >= games.length &&
                        games.length > (window.innerWidth <= 768 ? 4 : 7)
                          ? "View Less"
                          : "View More"}
                      </button>
                    )}
                    {games.length > 7 && window.innerWidth >= 768 && (
                      <button
                        className="display-button"
                        onClick={() =>
                          toggleGameDisplay(consoleType, games.length)
                        }
                      >
                        {visibleCount[consoleType] >= games.length &&
                        games.length > (window.innerWidth <= 768 ? 4 : 7)
                          ? "View Less"
                          : "View More"}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="filtered-games">
                <h3>{activeFilter}</h3>
                <div className="games-grid">
                  {games
                    .filter((game) => game.console === activeFilter)
                    .map((game, index) => (
                      <div
                        key={game.id}
                        className={`game-card ${
                          index < (prevVisibleCount[activeFilter] || 0)
                            ? ""
                            : index % 2 === 0
                            ? "from-left"
                            : "from-right"
                        }`}
                      >
                        <img
                          src={
                            game.imageUrl === "No Image"
                              ? noposter
                              : game.imageUrl
                          }
                          alt="Game poster"
                        />
                        <h4>{game.name}</h4>
                        <div className="game-info">
                          <p>{game.console}</p>
                          <p>{game.spMp}</p>
                          <p>{game.yearOfPublish}</p>
                          <p>Players: {game.playerCount}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoGamesSection;
