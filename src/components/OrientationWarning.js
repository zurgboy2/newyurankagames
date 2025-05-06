import React, { useEffect, useState, useRef } from 'react';
import './OrientationWarning.css';

function OrientationWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastOrientation = useRef(window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait');

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      const isSmallScreen = window.innerWidth < 1024;
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      const currentOrientation = isLandscape ? 'landscape' : 'portrait';

      // If orientation changes, reset the dismissed state
      if (currentOrientation !== lastOrientation.current) {
        lastOrientation.current = currentOrientation;
        setDismissed(false);
      }

      if (isMobile && isLandscape && isSmallScreen && !dismissed) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [dismissed]);

  const handleClose = () => {
    setShowWarning(false);
    setDismissed(true);
  };

  if (!showWarning) return null;

  return (
    <div className="orientation-modal-backdrop">
      <div className="orientation-modal">
        <button className="close-button" onClick={handleClose}>✕</button>
        <p>
          Site not configured for horizontal view yet.<br />
          Please rotate your phone for a better experience.
        </p>
      </div>
    </div>
  );
}

export default OrientationWarning;
