import { useEffect, useState } from "react"
import globeData from "@/data/globe.geo.json"
// import citiesData from "@/data/geonames-all-cities-with-a-population-1000@public.geo.json"
import citiesData from "@/data/ne_10m_populated_places_simple.geo.json"
import type { Feature, FeatureCollection } from "geojson"

export function useCountryPicker() {
	const [countries, setCountries] = useState<FeatureCollection | null>(null)
	const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null)
	const [hoveredCountry, setHoveredCountry] = useState<Feature | null>(null)
	const [cities, _setCities] = useState<FeatureCollection | null>(null)

	useEffect(() => {
		setCountries(globeData as unknown as FeatureCollection)
		_setCities(citiesData as unknown as FeatureCollection)
	}, [countries])

	return {
		cities,
		countries,
		selectedCountry,
		setSelectedCountry,
		hoveredCountry,
		setHoveredCountry,
	}
}
