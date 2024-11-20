import { useEffect, useState } from "react"
import globeData from "@/data/globe.geo.json"
import type { Feature, FeatureCollection } from "geojson"

export function useCountryPicker() {
	const [countries, setCountries] = useState<FeatureCollection | null>(null)
	const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null)

	useEffect(() => {
		setCountries(globeData as unknown as FeatureCollection)
	}, [countries])

	return { countries, selectedCountry, setSelectedCountry }
}
