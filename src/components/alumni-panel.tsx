import type { Alumni } from "@/data/mockAlumni";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Feature } from "geojson";
import { Linkedin, X, ArrowLeft, MapPinIcon, UserIcon } from "lucide-react";
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
        "bg-gradient-to-br from-gray-100/80 via-[#CFB991]/80 to-gray-100/80 bg-opacity-80 backdrop-blur-md border-orange-100 border",
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
              <button
                type="button"
                onClick={() => setSelectedAlumni(null)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to List
              </button>
              {/* <button */}
              {/*   type="button" */}
              {/*   onClick={onClose} */}
              {/*   className="rounded-full p-2 transition-colors hover:bg-gray-100" */}
              {/*   aria-label="Close panel" */}
              {/* > */}
              {/*   <X className="h-6 w-6 text-gray-600" /> */}
              {/* </button> */}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedAlumni.imageUrl && (
                  <img
                    src={selectedAlumni.imageUrl}
                    alt={selectedAlumni.first}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedAlumni.first} {selectedAlumni.last}
                  </h2>
                  <p className="text-gray-600">{selectedAlumni.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedAlumni.company && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Company:</span>{" "}
                    {selectedAlumni.company}
                  </p>
                )}
                {selectedAlumni.gradYear && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Graduated:</span>{" "}
                    {selectedAlumni.gradYear}
                  </p>
                )}
                {selectedAlumni.linkedIn && (
                  <a
                    href={selectedAlumni.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="h-5 w-5 mr-1" />
                    LinkedIn Profile
                  </a>
                )}
              </div>

              {selectedAlumni.details && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About
                  </h3>

                  <div
                    className="prose"
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
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-0 top-2 rounded-full p-2 transition-colors hover:bg-gray-100"
                  aria-label="Close panel"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {cityAlumni.map((alumnis) => (
                <div
                  key={`${alumnis.first} ${alumnis.last} - ${alumnis.title} -${alumnis.gradYear}`}
                  className="rounded-lg backdrop-filter bg-gray-100/70 backdrop-blur-md backdrop-opacity-80 p-4 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={alumnis.imageUrl} alt={alumnis.first} />
                      <AvatarFallback>
                        <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">
                        {alumnis.first} {alumnis.last}
                      </h3>
                      <p className="text-xl font-medium">{alumnis.title}</p>
                      <p className="text-xl">{alumnis.company}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          Class of {alumnis.gradYear}
                        </span>
                        {alumnis.linkedIn && (
                          <a
                            href={alumnis.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            aria-label={`Visit ${alumnis.first}'s LinkedIn profile`}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {alumnis.details && (
                        <Button onClick={() => setSelectedAlumni(alumnis)}>
                          Read more
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
