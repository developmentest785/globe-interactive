import { motion } from 'framer-motion';
import { Alumni } from '@/data/mockAlumni';
import type { Feature } from 'geojson';
import { X, Linkedin } from 'lucide-react';

interface AlumniPanelProps {
  country: Feature | null;
  alumni: Alumni[];
  onClose: () => void;
}

export default function AlumniPanel({
  country,
  alumni,
  onClose
}: AlumniPanelProps) {
  if (!country) return null;

  const countryName = country.properties?.ISO_A2;
  if (!countryName) return null;

  const countryFullName = country.properties?.NAME;

  const countryAlumni = alumni.filter((a) => a.country === countryName);
  if (countryAlumni.length === 0) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed right-0 top-0 z-20 h-full w-96 bg-white shadow-xl overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {`${countryFullName}${countryAlumni.length ? "'s" : ''}`} Alumni
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="text-gray-500 text-sm mb-6">
            {countryAlumni.length} alumni from{' '}
            {`${countryFullName} ${countryAlumni.length === 1 ? 'is' : 'are'}`}
            {} part of our community.
          </div>
        </div>

        <div className="space-y-6">
          {countryAlumni.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={alumnus.imageUrl}
                  alt={alumnus.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {alumnus.name}
                  </h3>
                  <p className="text-sm text-gray-600">{alumnus.role}</p>
                  <p className="text-sm text-gray-600">{alumnus.company}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Class of {alumnus.graduationYear}
                    </span>
                    {alumnus.linkedIn && (
                      <a
                        href={alumnus.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        aria-label={`Visit ${alumnus.name}'s LinkedIn profile`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
