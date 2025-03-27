import type { Alumni } from "@/data/mockAlumni";
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
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-md max-h-[80%] z-20  w-[80%] overflow-y-auto",
        "bg-gradient-to-br from-gray-100/80 via-[#CFB991]/80 to-gray-100/80 bg-opacity-80 backdrop-blur-md border-orange-100/40 border",
        "scale-150",
      )}
      // className="fixed transform translate rounded-sm z-20 h-fit max-h-[80%] overflow-y-auto bg-white shadow-xl"
    >
      <AnimatePresence mode="wait">
        {selectedAlumni ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="relative p-6"
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
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
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
