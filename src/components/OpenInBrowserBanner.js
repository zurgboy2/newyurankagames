import "./OpenInBrowserBanner.css";

const OpenInBrowserBanner = ({ onClose }) => {
  const currentUrl = window.location.href;

  return (
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
          <br />
          <b>Tip:</b> Tap the <b>⋮</b> (three dots) in Instagram’s top right and
          choose <b>‘Open in Browser’</b>.<br />
          Or <b>long-press the link below</b> and select{" "}
          <b>‘Open in Browser’</b>:
        </span>
        <a
          href={currentUrl}
          className="open-browser-btn"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginTop: "14px",
            wordBreak: "break-all",
          }}
        >
          {currentUrl}
        </a>
      </div>
    </div>
  );
};

export default OpenInBrowserBanner;
