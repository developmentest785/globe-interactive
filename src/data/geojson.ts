import type { Feature } from "geojson";

interface GeoJSONFeature extends Feature {
  lng: number;
  lat: number;
  size: number;
}

// Function to load GeoJSON data
export const loadGeoJSON = async () => {
  const response = await fetch(
    "../data/geonames-all-cities-with-a-population-1000@public.geo.json",
  );
  const data = await response.json();
  console.log("GeoJSON data loaded:", data);
  return data;
};

// Function to process GeoJSON data
export const processGeoJSON = (data: any) => {
  const features = data.features as GeoJSONFeature[];

  // Extract unique countries
  const countriesMap = new Map<string, string>();
  const statesByCountryMap = new Map<string, Map<string, string>>();
  const citiesByStateMap = new Map<string, Feature[]>();

  features.forEach((feature) => {
    const countryCode = feature.properties?.country_code;
    const countryName = feature.properties?.cou_name_en || countryCode;
    // test to check if its a number or text if its a number then check admin2_code exists if yes then show the admin2_code

    const admin1Code = feature.properties?.admin1_code;
    const admin2Code = feature.properties?.admin2_code;

    // Use admin2_code if admin1_code is a number, otherwise use admin1_code
    const stateCode =
      /^\d+$/.test(admin1Code) && admin2Code ? admin2Code : admin1Code;
    const stateName = stateCode || "";
    const countryStateKey = `${countryCode}-${stateCode}`;

    // Add country if not exists
    if (countryCode && !countriesMap.has(countryCode)) {
      countriesMap.set(countryCode, countryName);
    }

    // Add state if not exists
    if (countryCode && stateCode) {
      if (!statesByCountryMap.has(countryCode)) {
        statesByCountryMap.set(countryCode, new Map<string, string>());
      }

      const statesMap = statesByCountryMap.get(countryCode);
      if (statesMap && !statesMap.has(stateCode)) {
        statesMap.set(stateCode, stateName);
      }
    }

    // Add city by state
    if (countryStateKey) {
      if (!citiesByStateMap.has(countryStateKey)) {
        citiesByStateMap.set(countryStateKey, []);
      }

      const cities = citiesByStateMap.get(countryStateKey);
      if (cities) {
        cities.push(feature);
      }
    }
  });

  return {
    countries: Array.from(countriesMap.entries()).map(([code, name]) => ({
      code,
      name,
    })),
    statesByCountry: Object.fromEntries(
      Array.from(statesByCountryMap.entries()).map(
        ([countryCode, statesMap]) => [
          countryCode,
          Array.from(statesMap.entries()).map(([code, name]) => ({
            code,
            name,
          })),
        ],
      ),
    ),
    citiesByState: Object.fromEntries(
      Array.from(citiesByStateMap.entries()).map(
        ([countryStateKey, cities]) => [countryStateKey, cities],
      ),
    ),
  };
};
