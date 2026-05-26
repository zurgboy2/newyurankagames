import { useState, useEffect } from "react";
import { makeRegistrationRequestCall } from "../api/api";
import "./BoardGames.css";
import noposter from "../assets/noposter.avif";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const BoardGamesSection = () => {
  const [games, setGames] = useState([]);
  const [allVisible, setAllVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [forSaleGames, setForSaleGames] = useState([]);
  const [forRentGames, setForRentGames] = useState([]);
  const [visibleForSale, setVisibleForSale] = useState(
    window.innerWidth > 768 ? 10 : 4
  );
  const [visibleForRent, setVisibleForRent] = useState(
    window.innerWidth > 768 ? 10 : 4
  );

  const navigate = useNavigate();

  const handleReserveGame = () => {
    navigate("/reservations");
  };

  useEffect(() => {
    fetchBoardGames();
  }, []);

  const fetchBoardGames = async () => {
    try {
      const response = await makeRegistrationRequestCall(
        "games_script",
        "getBoardGames"
      );
      const allGames = response.games;

      const saleGames = allGames.filter((game) => game.sellable === true);
      const rentGames = allGames.filter((game) => !game.sellable);

      setGames(allGames);
      setForSaleGames(saleGames);
      setForRentGames(rentGames);
    } catch (error) {
      console.error("Error fetching board games:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreForSale = () => setVisibleForSale((prev) => prev + 10);

  const viewAll = () => {
    setVisibleForSale(forSaleGames.length);
    setVisibleForRent(forRentGames.length);
    setAllVisible(true);
  };

  const filteredForSale = forSaleGames.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredForRent = forRentGames.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="boardgames-container">
      <h1 className="board-games-title">Board Games</h1>

      <div className="responsive-align">
        <h3 className="board-games-caption">
          {" "}
          Browse our wide range of board games available for purchase or rent
          and reserve a Big or Small Table to play!
        </h3>
        <h3 className="board-games-caption">
          A Big Table seats 6 for board games or 4 for TCGs. A Small Table seats
          4 for board games or 2 for TCGs.
        </h3>

        <div className="board-games-button-wrapper">
          <Button size="lg" onClick={handleReserveGame}>Reserve a Table</Button>
        </div>

        <div className="search-and-button-wrapper">
          <div className="boardsearch-bar-container">
            <Input
              type="text"
              placeholder="Search for a game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="boardsearch-bar-container-input"
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="flex2">
            <Button variant="outline" onClick={viewAll}>View All Board Games</Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-screen">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading Board Games...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* For Sale Section */}
          <section className="for-sale-section">
            <h2 className="boardgames-subtitle">For Sale</h2>
            <div className="boardgames-grid">
              {filteredForSale.slice(0, visibleForSale).map((game, index) => (
                <div key={index} className="card">
                  <img
                    src={
                      game.imageUrl === "No Image" ? noposter : game.imageUrl
                    }
                    alt="Game poster"
                  />
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>
                  <p>
                    <strong>Price:</strong> € {game.price}
                  </p>
                  <p>
                    <strong>Players:</strong> {game.playerCount}
                  </p>
                  <p>
                    <strong>Expansion:</strong> {game.expansion}
                  </p>
                  <p>
                    <strong>Language:</strong> {game.language}
                  </p>
                  <p>
                    <strong>Time:</strong> {game.time}
                  </p>
                  {game.shopifyURL && (
                    <a
                      href={game.shopifyURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="buy-now-button">Buy Now</Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
            {visibleForSale < filteredForSale.length && (
              <div className="boardgames-text-center">
                <Button variant="outline" onClick={loadMoreForSale}>View More</Button>
              </div>
            )}
          </section>

          {/* For Rent Section */}
          <section className="for-rent-section">
            <h2 className="boardgames-subtitle">For Rent</h2>
            <h3 className="forrent-subtitle">
              Browse our wide collection of Board Games and reserve a table to
              play!
            </h3>
            <div className="boardgames-grid">
              {filteredForRent.slice(0, visibleForRent).map((game, index) => (
                <div key={index} className="card">
                  <img
                    src={
                      game.imageUrl === "No Image" ? noposter : game.imageUrl
                    }
                    alt="Game poster"
                  />
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>
                  <p>
                    <strong>Players:</strong> {game.playerCount}
                  </p>
                  <p>
                    <strong>Expansion:</strong> {game.expansion}
                  </p>
                  <p>
                    <strong>Language:</strong> {game.language}
                  </p>
                  <p>
                    <strong>Time:</strong> {game.time}
                  </p>
                </div>
              ))}
            </div>
            {visibleForRent < filteredForRent.length && (
              <div className="boardgames-text-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleForRent(filteredForRent.length)}
                >
                  View More
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BoardGamesSection;
