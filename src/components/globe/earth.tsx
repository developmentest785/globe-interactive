import React, { useEffect, useState } from "react"
import background from "@/assets/earth-dark.jpg"
import sky from "@/assets/night-sky.png"
import { mockAlumni } from "@/data/mockAlumni"
import { AnimatePresence } from "framer-motion"
import { Feature } from "geojson"
import Globe, { GlobeMethods, GlobeProps } from "react-globe.gl"

import { useCountryPicker } from "@/hooks/use-country-picker"
import useViewport from "@/hooks/useViewport"

import AlumniPanel from "@/components/alumni-panel"
import { ErrorBoundary } from "@/components/error-boundary"

export interface EarthProps extends GlobeProps {
	data?: Feature[]
}

const Earth = React.forwardRef<GlobeMethods, EarthProps>(
	({ data = [], ...props }, ref) => {
		const globeRef = ref as React.MutableRefObject<GlobeMethods>
		const { width, height } = useViewport()
		const { selectedCountry, setSelectedCountry } = useCountryPicker()
		const [hoveredEarth, setHoveredEarth] = useState<boolean>(false)
		const [hoveredCountry, setHoveredCountry] = useState<Feature | null>(null)

		const onGlobeReady = () => {
			console.log("globe ready")
			if (globeRef?.current) {
				globeRef.current.controls().autoRotate = true
				globeRef.current.controls().autoRotateSpeed = 0.3
				globeRef.current.pointOfView(
					{
						lat: 0,
						altitude: 2,
					},
					3000
				)
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
						feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2 + 28
					const lat =
						feature.bbox &&
						feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2 + 5
					console.log("lng", lng, "lat", lat)

					if (globeRef?.current) {
						globeRef.current.pointOfView(
							{
								altitude: 1,
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
								altitude: 1,
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
				globeRef.current.controls().autoRotate = false
				setSelectedCountry(feature)
			} else {
				console.log("reset globe")
				globeRef.current.controls().autoRotate = true
				globeRef.current.pointOfView(
					{
						lat: 0,
						altitude: 2,
					},
					1500
				)
				setSelectedCountry(null)
			}
		}

		useEffect(() => {
			if (!globeRef?.current) return
			const resetGlobe = setTimeout(() => {
				if (hoveredEarth && selectedCountry) return
				if (globeRef?.current) {
					console.log("reset globe")
					globeRef.current.controls().autoRotate = true
					globeRef.current.pointOfView(
						{
							lat: 0,
							altitude: 2,
						},
						1500
					)
				}
			}, 1500)
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
						altitude: 2,
					},
					1500
				)
			}
		}, [selectedCountry, globeRef])

		return (
			<ErrorBoundary>
				<Globe
					ref={ref as React.MutableRefObject<GlobeMethods>}
					backgroundImageUrl={sky}
					globeImageUrl={background}
					width={window.innerWidth | width}
					height={window.innerHeight | height}
					waitForGlobeReady={true}
					polygonsData={data}
					atmosphereAltitude={0.1}
					atmosphereColor="#aaa"
					polygonAltitude={(d) => {
						switch (d) {
							case hoveredCountry && selectedCountry:
								return 0.06
							case hoveredCountry:
								return 0.03
							case selectedCountry:
								return 0.06
							default:
								return 0.01
						}
					}}
					polygonsTransitionDuration={300}
					polygonCapColor={(d) => {
						switch (d) {
							default:
								return "transparent"
						}
					}}
					polygonSideColor={(d) => {
						switch (d) {
							case hoveredCountry:
								return "#bbb"
							case hoveredCountry && selectedCountry:
								return "#eee"
							case selectedCountry:
								return "#666"
							default:
								return "transparent"
						}
					}}
					polygonStrokeColor={(d) => {
						// d === (hoveredCountry || selectedCountry) ? '#eee' : '#666'
						switch (d) {
							case hoveredCountry:
								return "#bbb"
							case hoveredCountry && selectedCountry:
								return "#eee"
							case selectedCountry:
								return "#666"
							default:
								return "#666"
						}
					}}
					onPolygonHover={handleCountryHover}
					onPolygonClick={handleCountryClick}
					onGlobeClick={() => setSelectedCountry(null)}
					pointLat={0}
					pointLng={0}
					pointAltitude={2}
					onGlobeReady={onGlobeReady}
					{...props}
				/>

				{selectedCountry && (
					<AnimatePresence>
						<AlumniPanel
							country={selectedCountry}
							alumni={mockAlumni}
							onClose={() => setSelectedCountry(null)}
						/>
					</AnimatePresence>
				)}
			</ErrorBoundary>
		)
	}
)

Earth.displayName = "Earth"

export default Earth
