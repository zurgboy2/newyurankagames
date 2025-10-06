import "./OpenInBrowserBanner.css";

const OpenInBrowserBanner = ({ onClose }) => (
  <div className="open-in-browser-popup-overlay">
    <div
      className="open-in-browser-popup-container"
      style={{ position: "relative" }}
    >
      <button
        className="close-banner-btn"
        onClick={onClose}
        aria-label="Close"
        title="Close"
      >
        ×
      </button>
      <span className="banner-text">
        For the best experience, please open this page in your browser.
      </span>
      <button
        className="open-browser-btn"
        onClick={() => window.open(window.location.href, "_blank")}
      >
        Open in Browser
      </button>
    </div>
  </div>
);

export default OpenInBrowserBanner;
