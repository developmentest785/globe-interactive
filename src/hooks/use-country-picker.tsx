import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import globeData from "@/data/globe.geo.json";
import citiesData from "@/data/processed-cities.geo.json";
import type { Feature, FeatureCollection } from "geojson";

interface CountryPickerContextProps {
  countries: FeatureCollection | null;
  selectedCountry: Feature | null;
  setSelectedCountry: (country: Feature | null) => void;
  hoveredCountry: Feature | null;
  setHoveredCountry: (country: Feature | null) => void;
  cities: Feature[] | null;
  selectedCity: Feature | null;
  setSelectedCity: (city: Feature | null) => void;
  hoveredCity: Feature | null;
  setHoveredCity: (city: Feature | null) => void;
}

const CountryPickerContext = createContext<
  CountryPickerContextProps | undefined
>(undefined);

export const CountryPickerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [countries, setCountries] = useState<FeatureCollection | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Feature | null>(null);
  const [cities, setCities] = useState<Feature[] | null>(null);
  const [hoveredCity, setHoveredCity] = useState<Feature | null>(null);
  const [selectedCity, setSelectedCity] = useState<Feature | null>(null);

  useEffect(() => {
    setCountries(globeData as unknown as FeatureCollection);
    setCities(citiesData as unknown as Feature[]);
  }, []);

  return (
    <CountryPickerContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        hoveredCountry,
        setHoveredCountry,
        cities,
        selectedCity,
        setSelectedCity,
        hoveredCity,
        setHoveredCity,
      }}
    >
      {children}
    </CountryPickerContext.Provider>
  );
};

export const useCountryPicker = () => {
  const context = useContext(CountryPickerContext);
  if (context === undefined) {
    throw new Error(
      "useCountryPicker must be used within a CountryPickerProvider",
    );
  }
  return context;
};
