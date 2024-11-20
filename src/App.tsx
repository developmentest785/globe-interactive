import { mockAlumni } from './data/mockAlumni';
import { AnimatePresence } from 'framer-motion';
import { GlobeMethods, GlobeProps } from 'react-globe.gl';
import background from '@/assets/earth-dark.jpg';
import sky from '@/assets/night-sky.png';
import { useCountryPicker } from '@/hooks/use-country-picker';
import { Loader } from 'lucide-react';
import { useEffect, useRef, useState, Suspense } from 'react';
import Earth from '@/components/globe/earth-fiber';
import { ErrorBoundary } from '@/components/error-boundary';
import AlumniPanel from '@/components/alumni-panel';
import { Feature } from 'geojson';

const Loading = () => (
  <Loader className="absolute top-1/2 left-1/2 animate-spin" />
);
function App() {
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);
  const globeEl = useRef() as React.MutableRefObject<GlobeMethods>;
  const [hoveredEarth, setHoveredEarth] = useState<boolean>(false);
  const [polygonData, setPolygonData] = useState<Feature[]>([]);

  const { countries } = useCountryPicker();
  const handleCountryClick: GlobeProps['onPolygonClick'] = (e) => {
    const feature = e as Feature;
    if (!feature.properties) return;
    if (feature) {
      if (feature.properties.ISO_A2 === 'US') {
        const lng =
          feature.bbox &&
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2 + 28;
        const lat =
          feature.bbox &&
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2 + 5;
        console.log('lng', lng, 'lat', lat);

        globeEl.current.pointOfView(
          {
            altitude: 1,
            lng: lng,
            lat: lat
          },
          3000
        );
      } else {
        globeEl.current.pointOfView(
          {
            altitude: 1,
            // bbox to lng lat
            lng:
              feature.bbox &&
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
            lat:
              feature.bbox &&
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
          },
          3000
        );
      }
      globeEl.current.controls().autoRotate = false;
      setSelectedCountry(feature);
    } else {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.pointOfView(
        {
          lat: 0,
          altitude: 2
        },
        3000
      );
      setSelectedCountry(null);
    }
  };

  const handleCountryHover: GlobeProps['onPolygonHover'] = (d) => {
    if (d) {
      setHoveredEarth(true);
      globeEl.current.controls().autoRotate = false;
    } else {
      setHoveredEarth(false);
      globeEl.current.controls().autoRotate = true;
    }
  };

  useEffect(() => {
    if (!countries) return;
    const updatedCountries = countries.features
      .map((country) => {
        const alumni = mockAlumni.filter(
          (alumnus) => alumnus.country === country.properties?.ISO_A2
        );
        if (alumni.length > 0) {
          return country;
        }
        return null;
      })
      .filter((country) => country !== null) as Feature[];
    setPolygonData(updatedCountries);
  }, [countries]);

  useEffect(() => {
    if (!globeEl.current) return;
    const resetGlobe = setTimeout(() => {
      if (hoveredEarth && selectedCountry) return;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.pointOfView(
        {
          lat: 0,
          altitude: 2
        },
        3000
      );
    }, 3000);
    return () => clearTimeout(resetGlobe);
  }, [hoveredEarth, selectedCountry, globeEl]);

  useEffect(() => {
    if (!globeEl.current) return;
    if (!selectedCountry) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.pointOfView(
        {
          lat: 0,
          altitude: 2
        },
        3000
      );
    }
  }, [selectedCountry]);

  return (
    <div className="w-full h-screen relative">
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          {countries && (
            <Earth
              waitForGlobeReady={true}
              ref={globeEl}
              backgroundImageUrl={sky}
              globeImageUrl={background}
              polygonsData={polygonData}
              showAtmosphere={true}
              atmosphereAltitude={0.1}
              atmosphereColor="rgba(255,255,255, 0.8)"
              polygonAltitude={0.01}
              polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
              polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
              polygonStrokeColor={() => 'rgba(255, 255, 255, 0.4)'}
              onPolygonHover={handleCountryHover}
              onPolygonClick={handleCountryClick}
              onGlobeClick={() => setSelectedCountry(null)}
              pointLat={0}
              pointLng={0}
              pointAltitude={2}
              onGlobeReady={() => {
                globeEl.current.controls().autoRotate = true;
                globeEl.current.controls().autoRotateSpeed = 0.3;
              }}
            />
          )}
        </ErrorBoundary>
      </Suspense>
      <AnimatePresence>
        {selectedCountry && (
          <AlumniPanel
            country={selectedCountry.properties?.ISO_A2}
            alumni={mockAlumni}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
