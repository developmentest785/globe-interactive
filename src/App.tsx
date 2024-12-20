import { useEffect, useRef, useState } from "react"
import background from "@/assets/earth-blue-marble.jpg"
import bump from "@/assets/earth-topology.png"
import { AnimatePresence } from "framer-motion"
import { Feature } from "geojson"
import { Maximize, Shrink } from "lucide-react"
import Globe from "react-globe.gl"
import type { GlobeMethods, GlobeProps } from "react-globe.gl"

import { cn } from "@/lib/utils"
import { useCountryPicker } from "@/hooks/use-country-picker"
import useViewport from "@/hooks/useViewport"

import AlumniPanel from "@/components/alumni-panel"

import { mockAlumni } from "./data/mockAlumni"

function App() {
	const globeRef = useRef<GlobeMethods | undefined>(undefined)
	const { countries } = useCountryPicker()
	const [polygonData, setPolygonData] = useState<Feature[]>([])
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
	const { width, height } = useViewport()
	const { selectedCountry, setSelectedCountry } = useCountryPicker()
	const [hoveredEarth, setHoveredEarth] = useState<boolean>(false)
	const [hoveredCountry, setHoveredCountry] = useState<Feature | null>(null)

	const onGlobeReady = () => {
		console.log("globe ready")
		if (globeRef?.current) {
			globeRef.current.controls().autoRotate = true
			globeRef.current.controls().autoRotateSpeed = 0.3
		}
	}

	const handleCountryHover: GlobeProps["onPolygonHover"] = (d) => {
		if (d) {
			if (globeRef?.current) {
				console.log("hovered country", d, globeRef.current.pointOfView())
				setHoveredEarth(true)
				setHoveredCountry(d as Feature)
				globeRef.current.controls().autoRotate = false
			}
		} else {
			if (selectedCountry) return
			if (globeRef?.current) {
				console.log("reset globe")
				setHoveredEarth(false)
				setHoveredCountry(null)
				globeRef.current.controls().autoRotate = true
			}
		}
	}

	const handleCountryClick: GlobeProps["onPolygonClick"] = (e) => {
		const feature = e as Feature
		if (!feature.properties) return
		if (feature) {
			console.log("clicked country", feature.properties.ISO_A2)
			if (feature.properties.ISO_A2 === "US") {
				const lng =
					feature.bbox &&
					feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2 + 18
				const lat =
					feature.bbox &&
					feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
				console.log("lng", lng, "lat", lat)

				if (globeRef?.current) {
					globeRef.current.pointOfView(
						{
							altitude: 1.5,
							lng: lng,
							lat: lat,
						},
						1500
					)
				}
			} else {
				if (globeRef?.current) {
					globeRef.current.pointOfView(
						{
							altitude: 1.5,
							// bbox to lng lat
							lng:
								feature.bbox &&
								feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
							lat:
								feature.bbox &&
								feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
						},
						1500
					)
				}
			}
			if (globeRef.current) {
				globeRef.current.controls().autoRotate = false
			}
			setSelectedCountry(feature)
		} else {
			console.log("reset globe")
			if (globeRef.current) {
				globeRef.current.controls().autoRotate = true
				globeRef.current.pointOfView(
					{
						lat: 0,
						altitude: 3.4,
					},
					1500
				)
				setSelectedCountry(null)
			}
		}
	}

	useEffect(() => {
		if (!globeRef?.current) return
		const resetGlobe = setTimeout(() => {
			if (hoveredEarth && selectedCountry) return
			if (globeRef?.current) {
				console.log("reset globe")
				// globeRef.current.controls().autoRotate = true
				globeRef.current.pointOfView(
					{
						lat: 0,
						altitude: 3.4,
					},
					1500
				)
			}
		}, 5000)
		return () => clearTimeout(resetGlobe)
	}, [hoveredEarth, selectedCountry, globeRef])

	useEffect(() => {
		if (!globeRef?.current) return
		const { lat, altitude } = globeRef.current.pointOfView()

		if (!selectedCountry) {
			console.log("reset globe")
			globeRef.current.controls().autoRotate = true
			setHoveredCountry(null)
			if (lat === 0 && altitude === 2) return
			globeRef.current.pointOfView(
				{
					lat: 0,
					altitude: 3.4,
				},
				1500
			)
		}
	}, [selectedCountry, globeRef])

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

			<Globe
				ref={globeRef}
				animateIn={false}
				// backgroundImageUrl={sky}
				backgroundColor="rgba(0,0,0,0)"
				globeImageUrl={background}
				bumpImageUrl={bump}
				width={window.innerWidth | width}
				height={window.innerHeight | height}
				waitForGlobeReady={true}
				polygonsData={polygonData}
				atmosphereAltitude={0.15}
				atmosphereColor="#aaa"
				polygonAltitude={(d) => {
					switch (d) {
						case hoveredCountry && selectedCountry:
							return 0.06
						case selectedCountry:
							return 0.06
						default:
							return 0.01
					}
				}}
				polygonsTransitionDuration={300}
				polygonCapColor={(d) => {
					switch (d) {
						case hoveredCountry && selectedCountry:
							return "rgba(254, 215, 170, 1)"
						case selectedCountry:
							return "rgba(254, 215, 170, 1)"
						default:
							return "rgba(254, 215, 170, 0.6)"
					}
				}}
				polygonSideColor={(d) => {
					switch (d) {
						case hoveredCountry && selectedCountry:
							return "#fff"
						case selectedCountry:
							return "#fff"
						default:
							return "transparent"
					}
				}}
				polygonStrokeColor={(d) => {
					// d === (hoveredCountry || selectedCountry) ? '#eee' : '#666'
					switch (d) {
						case hoveredCountry && selectedCountry:
							return "#fff"
						case selectedCountry:
							return "#fff"
						default:
							return "#fff"
					}
				}}
				onPolygonHover={handleCountryHover}
				onPolygonClick={handleCountryClick}
				onGlobeClick={() => setSelectedCountry(null)}
				onGlobeReady={onGlobeReady}
				// create a border around the earth just like a dive has a border that is a circle
				// customLayerData={[
				// 	{
				// 		lat: 0,
				// 		lng: 0,
				// 		alt: -1,
				// 		radius: 110,
				// 		color: "green",
				// 	},
				// ]}
				// customThreeObject={(d) =>
				// 	new THREE.Mesh(
				// 		new THREE.SphereGeometry(d.radius, 32, 32),
				// 		new THREE.MeshLambertMaterial({
				// 			color: d.color,
				// 			transparent: true,
				// 			opacity: 1,
				// 		})
				// 	)
				// }
			/>

			{selectedCountry && (
				<AnimatePresence>
					<AlumniPanel
						key="panel"
						country={selectedCountry}
						alumni={mockAlumni}
						onClose={() => {
							setSelectedCountry(null)
							setHoveredCountry(null)
						}}
					/>
				</AnimatePresence>
			)}
		</div>
	)
}

export default App
