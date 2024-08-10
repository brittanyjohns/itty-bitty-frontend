import { useIonViewDidLeave } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

// Extend the Document and HTMLElement interfaces to include vendor-prefixed properties
declare global {
  interface Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void>;
    msFullscreenElement?: Element | null;
    msExitFullscreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const elem = document.documentElement;

    const enterFullscreen = () => {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.error(err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch((err) => console.error(err));
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch((err) => console.error(err));
      }
    };

    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFullscreenNow);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    // Automatically enter fullscreen on component mount
    enterFullscreen();

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useIonViewDidLeave(() => {
    if (isFullscreen) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch((err) => console.error(err));
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch((err) => console.error(err));
      }
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.error(err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch((err) => console.error(err));
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch((err) => console.error(err));
      }
    }
  };

  return (
    <button ref={buttonRef} onClick={toggleFullscreen}>
      <i className={`fas fa-${isFullscreen ? "expand" : "compress"}`}></i>
    </button>
  );
};

export default FullscreenToggle;
