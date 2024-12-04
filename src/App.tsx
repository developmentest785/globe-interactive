import { useRef, useState } from "react"
import { Feature } from "geojson"
import { Maximize, Shrink } from "lucide-react"
import { GlobeMethods } from "react-globe.gl"

import { cn } from "@/lib/utils"
import { useCountryPicker } from "@/hooks/use-country-picker"

import Earth from "@/components/globe/earth"

import { mockAlumni } from "./data/mockAlumni"

function App() {
	const globeRef = useRef<GlobeMethods>(null)
	const { countries } = useCountryPicker()
	const [polygonData, setPolygonData] = useState<Feature[]>([])
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

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

	const handleFullScreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen()
			setIsFullScreen(false)
		} else {
			document.body.requestFullscreen()
			setIsFullScreen(true)
		}
	}

	return (
		<div className={cn("relative h-screen w-full bg-orange-100")}>
			<button
				onClick={handleFullScreen}
				className="fixed right-4 top-4 z-10 h-10 w-10"
			>
				{isFullScreen ? <Shrink size={32} /> : <Maximize size={32} />}
			</button>
			<Earth ref={globeRef} data={polygonData} />
		</div>
	)
}

export default App
