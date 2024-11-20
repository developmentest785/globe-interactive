import { useRef, useState } from "react"
import { Feature } from "geojson"
import { GlobeMethods } from "react-globe.gl"

import { useCountryPicker } from "@/hooks/use-country-picker"

import Earth from "@/components/globe/earth"

import { mockAlumni } from "./data/mockAlumni"

function App() {
	const globeRef = useRef<GlobeMethods>(null)
	const { countries } = useCountryPicker()
	const [polygonData, setPolygonData] = useState<Feature[]>([])

	const updatedCountries = countries?.features
		.map((country) => {
			const alumni = mockAlumni.filter(
				(alumnus) => alumnus.country === country.properties?.ISO_A2
			)
			if (alumni.length > 0) {
				return country
			}
			return null
		})
		.filter((country) => country !== null) as Feature[]

	setTimeout(() => {
		setPolygonData(updatedCountries)
	}, 5000)

	return (
		<div className="relative h-screen w-full bg-gray-950">
			<Earth ref={globeRef} data={polygonData} />
		</div>
	)
}

export default App
