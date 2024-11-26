import { useRef, useState } from "react"
import { Feature } from "geojson"
import { GlobeMethods } from "react-globe.gl"

import { cn } from "@/lib/utils"
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
		<div
			className={cn(
				"relative h-screen w-full bg-orange-200"
				// create a circle in the middle of the screen
				// "after:absolute after:inset-1/2 after:z-10 after:h-[90vw] after:w-[90vw] after:max-w-[972px] after:-translate-x-1/2 after:-translate-y-1/2 after:transform after:rounded-full after:border after:border-black after:shadow-lg"
			)}
		>
			<Earth ref={globeRef} data={polygonData} />
		</div>
	)
}

export default App
