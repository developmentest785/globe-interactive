import { mockAlumni } from "@/data/mockAlumni";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useCountryPicker } from "@/hooks/use-country-picker";
import { cn } from "@/lib/utils";

import AlumniPanel from "@/components/alumni-panel";
import SimpleGlobe from "@/components/simple-globe";
// import sky1 from "@/assets/background.png";
// import sky3 from "@/assets/background_milky_way.jpg";
import bg1 from "@/assets/earth-blue-marble.jpg";
// import bg2 from "@/assets/earth-dark.jpg";
// import bg3 from "@/assets/earth-day.jpg";
// import bg4 from "@/assets/earth-night.jpg";
import sky2 from "@/assets/night-sky.png";

// logo purdue
import logo from "@/assets/logo.png";
import PurdueQrCode from "@/components/purdue-qrcode";
import { Button } from "./components/ui/button";

const initialState = {
  background: 0,
  sky: 2,
  hexColor: "#0f0f0f",
  markerSize: 30,
  resetTime: 30000,
};

function App() {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showExploreButton, setShowExploreButton] = useState<boolean>(true);
  const { selectedCity, setHoveredCity, setSelectedCity } = useCountryPicker();
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const resetInactivityTimer = () => {
    console.log("activity timeer");
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    setShowExploreButton(false);

    inactivityTimerRef.current = setTimeout(() => {
      console.log("timeout");
      handleFullScreen();
      setShowExploreButton(true);
      if (selectedCity) {
        setSelectedCity(null);
        setHoveredCity(null);
      }
    }, initialState.resetTime);
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      document.body.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleScreenClick = () => {
    if (showExploreButton) {
      setShowExploreButton(false);
      resetInactivityTimer();
    }
  };

  return (
    <div className={cn("relative h-screen w-full")} onClick={handleScreenClick}>
      <div className="inset-0 pointer-events-none absolute z-10 bg-linear-to-br from-transparent via-transparent via-75% to-180% to-[#CFB991]" />

      {/* Top Bar with Logo and Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-6">
        <img src={logo} alt="Purdue University" className="w-48" />
        <div className="flex flex-col items-center gap-2">
          {/* QR Code */}
          <div className="bg-linear-to-br from-gray-200/80 to-gray-300/90 backdrop-filter backdrop-blur-md p-2 rounded-lg shadow-md">
            <PurdueQrCode className={cn("w-32 h-32")} />
          </div>
          <p className="text-center text-lg font-bold text-white">
            Scan & Donate
          </p>
        </div>
      </div>

      {/* Explore Button */}
      <AnimatePresence>
        {showExploreButton && (
          <motion.div
            className="absolute left-1/2 bottom-12 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              className={cn(
                "pointer-events-auto h-16 text-black font-bold px-8 py-4 text-xl shadow-2xl shadow-[#72664f]",
                "bg-linear-to-br from-[#CFB991] from-50% to-white",
              )}
              onClick={() => setShowExploreButton(false)}
            >
              Click to Explore
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Globe */}
      <div className="absolute inset-0 z-0">
        <SimpleGlobe
          globeImg={bg1}
          background={sky2}
          markerSize={initialState.markerSize}
          hexColor={initialState.hexColor}
          onGlobeReset={() => setShowExploreButton(true)}
          onUserInteraction={resetInactivityTimer}
        />
      </div>

      {/* Alumni Panel */}
      {selectedCity?.properties?.name && (
        <AnimatePresence>
          <AlumniPanel
            key="panel"
            city={selectedCity}
            alumni={mockAlumni}
            onClose={() => {
              setSelectedCity(null);
              setHoveredCity(null);
            }}
          />
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;
