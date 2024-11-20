import { useEffect, useState } from 'react';
import type { FeatureCollection } from 'geojson';

import globeData from '@/data/globe.geo.json';

export function useCountryPicker() {
  const [countries, setCountries] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    setCountries(globeData as unknown as FeatureCollection);
  }, [countries]);

  const getCountryFromLatlng = (lat: number, lng: number): string | null => {
    if (!countries) return null;
    console.log('event', lat, lng);
    const country = countries.features.find((country) => {
      if (!country.geometry) return false;
      const [minLng, minLat, maxLng, maxLat] = country.bbox as [
        number,
        number,
        number,
        number
      ];
      return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    });
    console.log('country', country?.properties?.ISO_A2);
    return country?.properties?.ISO_A2 || null;
  };

  return { countries, getCountryFromLatlng };
}
