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
  resetTime: 20000,
};

function App() {
  const [showExploreButton, setShowExploreButton] = useState<boolean>(true);
  const [isInactive, setIsInactive] = useState<boolean>(true);
  const initialRender = useRef(true);
  const { selectedCity, setHoveredCity, setSelectedCity } = useCountryPicker();
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const resetInactivityTimer = () => {
    console.log("activity timer");
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (!initialRender.current) {
      setShowExploreButton(false);
      setIsInactive(false);
    }
    inactivityTimerRef.current = setTimeout(() => {
      console.log("timeout");
      setShowExploreButton(true);
      setIsInactive(true);
      if (selectedCity) {
        setSelectedCity(null);
        setHoveredCity(null);
      }
    }, initialState.resetTime);
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // const handleFullScreen = () => {
  //   if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //     setIsFullScreen(false);
  //   } else {
  //     document.body.requestFullscreen();
  //     setIsFullScreen(true);
  //   }
  // };

  const handleScreenClick = () => {
    if (showExploreButton) {
      setShowExploreButton(false);
      setIsInactive(false);
      resetInactivityTimer();
    }
  };

  return (
    <div className={cn("relative h-screen w-full")} onClick={handleScreenClick}>
      <div className="inset-0 pointer-events-none absolute z-10 bg-linear-to-br from-transparent via-transparent via-75% to-180% to-[#CFB991]" />

      {/* Top Bar with Logo and Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-6">
        <motion.img
          src={logo}
          alt="Purdue University"
          className="w-48"
          animate={{
            x: isInactive ? "calc(50vw - 7rem)" : 0,
            y: isInactive ? "calc(50vh - 10rem)" : 0,
            scale: isInactive ? 1.5 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence>
          {!isInactive && (
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* QR Code */}
              <div className="bg-linear-to-br from-gray-200/80 to-gray-300/90 backdrop-filter backdrop-blur-md p-2 rounded-lg shadow-md">
                <PurdueQrCode className={cn("w-32 h-32")} />
              </div>
              <p className="text-center text-lg font-bold text-white">
                Scan & Donate
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inactive Overlay */}
      <AnimatePresence>
        {isInactive && (
          <motion.div
            className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex flex-col pt-36 items-center justify-center">
              <Button
                className={cn(
                  "pointer-events-auto h-16 text-black font-bold px-8 py-4 text-xl shadow-2xl shadow-[#72664f]",
                  "bg-linear-to-br from-[#CFB991] from-50% to-white",
                  "scale-150 mt-36"
                )}
                onClick={() => {
                  setShowExploreButton(false);
                  setIsInactive(false);
                  resetInactivityTimer();
                }}
              >
                Click to Explore
              </Button>
            </div>
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
