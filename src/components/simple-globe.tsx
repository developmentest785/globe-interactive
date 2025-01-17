import { useEffect, useRef, useState } from "react"
import { mockAlumni } from "@/data/mockAlumni"
import { Feature } from "geojson"
import Globe from "react-globe.gl"
import type { GlobeMethods } from "react-globe.gl"
import * as THREE from "three"

import { cn } from "@/lib/utils"
import { useCountryPicker } from "@/hooks/use-country-picker"
import useViewport from "@/hooks/useViewport"

import cloudImg from "@/assets/clouds.png"
import bump from "@/assets/earth-topology.png"

interface SimpleGlobeProps {
	background: string
	globeImg: string
	backgroundColor: string
	markerColor: string
	markerSize: number
	hexColor: string
}

function SimpleGlobe({
	background,
	globeImg,
	backgroundColor,
	markerColor,
	markerSize,
	hexColor,
}: SimpleGlobeProps) {
	const globeRef = useRef<GlobeMethods | undefined>(undefined)
	const { countries, cities } = useCountryPicker()
	const [polygonData, setPolygonData] = useState<Feature[]>([])
	const [markerData, setMarkerData] = useState<Feature[]>([])
	const { width, height } = useViewport()
	const {
		selectedCountry,
		setSelectedCountry,
		// hoveredCountry,
		// setHoveredCountry,
	} = useCountryPicker()
	const [hoveredEarth, setHoveredEarth] = useState<boolean>(false)

	const markerSvg = `<svg style="color: ${markerColor}" viewBox="-4 0 36 36">
	  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
	  <circle fill="black" cx="14" cy="14" r="7"></circle>
	</svg>`

	const onGlobeReady = () => {
		const globe = globeRef.current
		if (globe) {
			console.log("globe ready")
			globe.controls().autoRotate = true
			globe.controls().autoRotateSpeed = 0.3

			const directionalLight = globe
				.lights()
				.find((obj3d) => obj3d.type === "DirectionalLight")
			// GlobeMethods.lights(): Light[] (+1 overload
			if (directionalLight) {
				directionalLight.position.set(0, 250, 150)
				directionalLight.intensity = 15
			}

			// Add clouds sphere
			const CLOUDS_ALT = 0.004
			const CLOUDS_ROTATION_SPEED = -0.01 // deg/frame

			new THREE.TextureLoader().load(cloudImg, (cloudsTexture) => {
				const clouds = new THREE.Mesh(
					new THREE.SphereGeometry(
						globe.getGlobeRadius() * (1 + CLOUDS_ALT),
						75,
						75
					),
					new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
				)
				globe.scene().add(clouds)
				;(function rotateClouds() {
					clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180
					requestAnimationFrame(rotateClouds)
				})()
			})
		}
	}
	const htmlElement = () => {
		const el = document.createElement("div") as HTMLDivElement
		el.innerHTML = markerSvg
		el.style.color = markerColor
		el.style.width = `${markerSize}px`

		el.style.cursor = "pointer"
		// el.onclick = () => console.info(d)
		return el
	}

	const updatedCities = cities?.features
		.map((city) => {
			const alumni = mockAlumni.filter(
				(alumnus) =>
					alumnus.city.toLowerCase() === city.properties?.name.toLowerCase()
			)
			if (alumni.length > 0) {
				return {
					...city,
					lng: city.properties?.longitude,
					lat: city.properties?.latitude,
					size: 10,
				}
			}
			return null
		})
		.filter((country) => country !== null) as Feature[]

	// const handleCountryHover: GlobeProps["onPolygonHover"] = (d) => {
	// 	if (d) {
	// 		if (globeRef?.current) {
	// 			console.log("hovered country", d, globeRef.current.pointOfView())
	// 			setHoveredEarth(true)
	// 			setHoveredCountry(d as Feature)
	// 			globeRef.current.controls().autoRotate = false
	// 		}
	// 	} else {
	// 		if (selectedCountry) return
	// 		if (globeRef?.current) {
	// 			console.log("reset globe")
	// 			setHoveredEarth(false)
	// 			setHoveredCountry(null)
	// 			globeRef.current.controls().autoRotate = true
	// 		}
	// 	}
	// }

	// const handleCountryClick: GlobeProps["onPolygonClick"] = (e) => {
	// 	const feature = e as Feature
	// 	if (!feature.properties) return
	// 	if (feature) {
	// 		console.log("clicked country", feature.properties.ISO_A2)
	// 		if (feature.properties.ISO_A2 === "US") {
	// 			const lng =
	// 				feature.bbox &&
	// 				feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2 + 18
	// 			const lat =
	// 				feature.bbox &&
	// 				feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
	// 			console.log("lng", lng, "lat", lat)

	// 			if (globeRef?.current) {
	// 				globeRef.current.pointOfView(
	// 					{
	// 						altitude: 1.5,
	// 						lng: lng,
	// 						lat: lat,
	// 					},
	// 					1500
	// 				)
	// 			}
	// 		} else {
	// 			if (globeRef?.current) {
	// 				globeRef.current.pointOfView(
	// 					{
	// 						altitude: 1.5,
	// 						// bbox to lng lat
	// 						lng:
	// 							feature.bbox &&
	// 							feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
	// 						lat:
	// 							feature.bbox &&
	// 							feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
	// 					},
	// 					1500
	// 				)
	// 			}
	// 		}
	// 		if (globeRef.current) {
	// 			globeRef.current.controls().autoRotate = false
	// 		}
	// 		setSelectedCountry(feature)
	// 	} else {
	// 		console.log("reset globe")
	// 		if (globeRef.current) {
	// 			globeRef.current.controls().autoRotate = true
	// 			globeRef.current.pointOfView(
	// 				{
	// 					lat: 0,
	// 					altitude: 3.4,
	// 				},
	// 				1500
	// 			)
	// 			setSelectedCountry(null)
	// 		}
	// 	}
	// }

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

	// useEffect(() => {
	// 	if (!globeRef?.current) return
	// 	const { lat, altitude } = globeRef.current.pointOfView()

	// 	if (!selectedCountry) {
	// 		console.log("reset globe")
	// 		globeRef.current.controls().autoRotate = true
	// 		setHoveredCountry(null)
	// 		if (lat === 0 && altitude === 2) return
	// 		globeRef.current.pointOfView(
	// 			{
	// 				lat: 0,
	// 				altitude: 3.4,
	// 			},
	// 			1500
	// 		)
	// 	}
	// }, [selectedCountry, globeRef])

	// const updatedCountries = countries?.features
	// 	.map((country) => {
	// 		const alumni = mockAlumni.filter(
	// 			(alumnus) => alumnus.country === country.properties?.ISO_A2
	// 		)
	// 		if (alumni.length > 0) {
	// 			return country
	// 		}
	// 		return null
	// 	})
	// 	.filter((country) => country !== null) as Feature[]

	return (
		<div className={cn("relative h-screen w-full")}>
			<Globe
				ref={globeRef}
				animateIn={false}
				backgroundImageUrl={background}
				backgroundColor={backgroundColor}
				globeImageUrl={globeImg}
				bumpImageUrl={bump}
				width={window.innerWidth | width}
				height={window.innerHeight | height}
				waitForGlobeReady={true}
				polygonsData={polygonData}
				atmosphereAltitude={0.15}
				atmosphereColor="#aaa"
				hexPolygonsData={countries?.features}
				hexPolygonResolution={3}
				hexPolygonMargin={0.2}
				hexPolygonUseDots={false}
				hexBinPointWeight={3}
				hexBinResolution={2}
				// hexPolygonAltitude={ polygonAltitude}
				hexMargin={0.2}
				// polygonAltitude={(d) => {
				// 	switch (d) {
				// 		case hoveredCountry && selectedCountry:
				// 			return 0.06
				// 		case selectedCountry:
				// 			return 0.06
				// 		default:
				// 			return 0.01
				// 	}
				// }}
				// polygonsTransitionDuration={300}
				// polygonCapColor={(d) => {
				// 	switch (d) {
				// 		case hoveredCountry && selectedCountry:
				// 			return "#FFD700"
				// 		case selectedCountry:
				// 			return "#FFD700"
				// 		default:
				// 			return "#FFD700"
				// 	}
				// }}
				// polygonSideColor={(d) => {
				// 	switch (d) {
				// 		case hoveredCountry && selectedCountry:
				// 			return "#fff"
				// 		case selectedCountry:
				// 			return "#fff"
				// 		default:
				// 			return "transparent"
				// 	}
				// }}
				// polygonStrokeColor={(d) => {
				// 	switch (d) {
				// 		case hoveredCountry && selectedCountry:
				// 			return "#fff"
				// 		case selectedCountry:
				// 			return "#fff"
				// 		default:
				// 			return "#fff"
				// 	}
				// }}
				// onPolygonHover={handleCountryHover}
				// onPolygonClick={handleCountryClick}
				onGlobeClick={() => setSelectedCountry(null)}
				onGlobeReady={onGlobeReady}
				htmlElementsData={updatedCities}
				htmlElement={htmlElement}
			/>
		</div>
	)
}

export default SimpleGlobe
