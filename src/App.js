import './App.css';
import { Navigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReservationsPage from './pages/ReservationsPage';
import AboutUsPage from './pages/AboutUsPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import VideoGamesPage from './pages/VideoGamesPage';
import BoardGamesPage from './pages/BoardGamesPage';
import MiniConsPage from './pages/MiniConsPage';
import StarWarsPage from './pages/StarWarsPage';
import CareersPage from './pages/CareersPage';
import OpenInBrowserBanner from './components/OpenInBrowserBanner';
import ResetPassword from './components/ResetPassword';
import BuyoutPage from './components/BuyoutPage';
import { useState, useEffect } from 'react';
import { isInstagramInAppBrowser } from './components/Utility';
import { Toaster } from './components/ui/sonner';

function App() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isInstagramInAppBrowser()) {
      setShowBanner(true);
    }
  }, []);

  return (
    <div className="bg-muted/20">
      {showBanner && (
        <OpenInBrowserBanner onClose={() => setShowBanner(false)} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/minicons" element={<MiniConsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login&signup" element={<Navigate to="/signup" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/videogames" element={<VideoGamesPage />} />
        <Route path="/boardgames" element={<BoardGamesPage />} />
        <Route path="/starwars" element={<StarWarsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/buyout" element={<BuyoutPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
