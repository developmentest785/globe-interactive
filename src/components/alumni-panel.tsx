import type { Alumni } from "@/data/mockAlumni";
import partnerLogo from "@/assets/partner-logo.webp";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Feature } from "geojson";
import {
  Linkedin,
  X,
  ArrowLeft,
  MapPinIcon,
  UserIcon,
  MoveRight,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface AlumniPanelProps {
  city: Feature | null;
  alumni: Alumni[];
  onClose: () => void;
}

export default function AlumniPanel({
  city,
  alumni,
  onClose,
}: AlumniPanelProps) {
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  if (!city) return null;

  const cityName = city.properties?.name;
  if (!cityName) return null;

  const cityAlumni = alumni.filter((alumnis) => {
    const cityAlumni = alumnis.address.split(",")[0];
    return (
      cityAlumni.toLowerCase() === city.properties?.name.toLowerCase() &&
      city.properties?.admin1_code &&
      city.properties?.admin1_code === alumnis.address.split(",")[1].trim()
    );
  });
  if (cityAlumni.length === 0) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      // center align the panel
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-md max-h-7/12 z-20 w-[60%] overflow-y-auto",
        "bg-gradient-to-br from-gray-100/80 via-[#CFB991]/80 to-gray-100/80 bg-opacity-80 backdrop-blur-md border-orange-100/40 border",
        "scale-150",
        "border-black border-4 py-10",
        // add backdrop blur
        "backdrop-blur-xs",
      )}
      // className="fixed transform translate rounded-sm z-20 h-fit max-h-[80%] overflow-y-auto bg-white shadow-xl"
    >
      <div className="relative">
        <div className="absolute -top-10 left-4 z-50 w-12 h-12">
          <div
            className={cn(
              "flex items-center justify-center text-white relative w-full h-full bg-black rounded-full",
              "after:bg-black after:absolute after:rounded-full after:-left-4 after:top-0 after:w-6 after:h-6",
            )}
          >
            <div className="flex flex-col items-center gap-0 px-2 relative z-10">
              <div className="flex items-center">
                <svg
                  className="object-contain w-full h-full"
                  viewBox="0 0 233 125"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M123.525 124.849L139.218 88.0317H165.19C202.781 88.0317 217.044 72.5962 226.907 49.4179C230.558 40.8437 236.671 26.4809 228.571 14.264C220.47 2.04699 203.521 0.708008 191.396 0.708008H53.3413L33.8725 46.449H58.8637L44.9585 79.0997H19.9171L0.439941 124.849H123.525Z"
                    fill="white"
                  />
                  <path
                    d="M221.527 18.9364C217.136 12.2832 207.555 9.18945 191.396 9.18945H58.9552L46.7132 37.9481H71.6628L50.5637 87.581H25.5227L13.2725 116.373H117.936L130.178 87.581H104.804L108.231 79.5389H165.191C201.833 79.5389 211.605 63.7375 219.107 46.0982C223.14 36.6007 226.65 26.6874 221.527 18.9364ZM125.937 37.9481H167.769C173.54 37.9481 172.709 40.8423 171.927 42.6387C170.749 45.1677 168.847 47.2904 166.462 48.7383C164.077 50.1861 161.316 50.8939 158.529 50.7722H120.481L125.937 37.9481Z"
                    fill="#050917"
                  />
                  <path
                    d="M191.396 13.608H61.8658L53.3746 33.5676H78.3658L53.4828 91.9913H28.4416L19.9421 111.951H115.025L123.525 91.9913H98.1342L105.32 75.1254H165.199C199.521 75.1254 208.154 60.5881 215.098 44.3542C222.042 28.1204 225.768 13.583 191.446 13.583M158.604 55.1657H113.861L123.075 33.5427H167.818C175.736 33.5427 178.929 37.6095 176.06 44.3542C174.564 47.6963 172.1 50.513 168.987 52.4403C165.874 54.3677 162.254 55.317 158.595 55.1657"
                    fill="#CFB991"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 right-4 z-50 w-12 h-12">
          <div
            className={cn(
              "flex items-center justify-center text-white relative w-full h-full bg-black rounded-full",
              "after:bg-black after:absolute after:rounded-full after:-right-4 after:bottom-0 after:w-6 after:h-6",
            )}
          >
            <div className="flex flex-col items-center gap-0 px-2 relative z-10">
              <span className="text-[6px] font-bold">Powered by</span>
              <div className="flex items-center">
                <img
                  src={partnerLogo}
                  alt="Partner Logo"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selectedAlumni ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className="relative p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAlumni(null)}
                  className="flex items-center text-black"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to Alumni List
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full [&_svg]:size-8 size-12"
                  aria-label="Close panel"
                >
                  <X />
                </Button>
              </div>

              <div className="space-y-6">
                <AlumniCard
                  alumni={selectedAlumni}
                  isSelected={!!selectedAlumni}
                  onSelectedAlumni={(e) => setSelectedAlumni(e)}
                />
                {selectedAlumni.details && (
                  <div className="mt-4 border-t border-black pt-4">
                    <h3 className="text-xl font-bold mb-2">About</h3>

                    <div
                      className="prose font-medium"
                      dangerouslySetInnerHTML={{
                        __html: selectedAlumni.details,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              className="relative p-6"
            >
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-5xl text-black">
                      {cityAlumni.length} Alumni
                    </h2>
                    <div className="flex gap-1">
                      <MapPinIcon className="w-7 h-7" />
                      <p className="text-2xl">{`${cityName}`} </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-0 top-2 rounded-full [&_svg]:size-8 size-12"
                    aria-label="Close panel"
                  >
                    <X size={72} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {cityAlumni.map((alumni) => (
                  <div
                    key={`${alumni.first} ${alumni.last} - ${alumni.title} -${alumni.gradYear}`}
                    className="rounded-lg backdrop-filter bg-gray-100/70 backdrop-blur-md backdrop-opacity-80 p-4 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <AlumniCard
                      alumni={alumni}
                      onSelectedAlumni={(e) => setSelectedAlumni(e)}
                      isSelected={!!selectedAlumni}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const AlumniCard = ({
  alumni,
  isSelected,
  onSelectedAlumni,
}: {
  alumni: Alumni;
  isSelected: boolean;
  onSelectedAlumni: (alumni: Alumni) => void;
}) => {
  return (
    <div className="flex items-start space-x-4">
      <Avatar className="w-20 h-20">
        <AvatarImage src={alumni.imageUrl} alt={alumni.first} />
        <AvatarFallback>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-2xl font-bold">
          {alumni.first} {alumni.last}
        </h3>
        <p className="text-xl font-medium">
          {alumni.title} {alumni.company && `| ${alumni.company}`}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Class of {alumni.gradYear}</span>
          {alumni.linkedIn && (
            <a
              href={alumni.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
              aria-label={`Visit ${alumni.first}'s LinkedIn profile`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
        {!isSelected && (
          <div className="mt-2">
            {alumni.details && (
              <Button
                className="text-bold"
                size="sm"
                onClick={() => onSelectedAlumni(alumni)}
              >
                Read more <MoveRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
