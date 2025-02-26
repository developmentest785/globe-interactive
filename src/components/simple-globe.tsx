import { useEffect, useRef } from "react"
import { mockAlumni } from "@/data/mockAlumni"
import type { Feature } from "geojson"
import type { GlobeMethods } from "react-globe.gl"
import Globe from "react-globe.gl"
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
	const {
		countries,
		cities,
		selectedCountry,
		setSelectedCountry,
		selectedCity,
		setSelectedCity,
	} = useCountryPicker()
	const { width, height } = useViewport()

	const INIT_GLOBE = {
		lat: 0,
		lng: 0,
		altitude: 3.4,
		selectedAltitude: 0.5,
		animDuration: 1500,
	}

	const markerSvg = `<svg style="color: ${markerColor}" viewBox="-4 0 36 36">
	  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
	  <circle fill={${hexColor}} cx="14" cy="14" r="7"></circle>
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
					new THREE.MeshPhongMaterial({
						map: cloudsTexture,
						transparent: true,
					})
				)
				globe.scene().add(clouds)
				;(function rotateClouds() {
					clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180
					requestAnimationFrame(rotateClouds)
				})()
			})
		}
	}

	// @ts-ignore
	const createMarkerElement = (d: Object) => {
		const data = d as Feature
		const el = document.createElement("div") as HTMLDivElement
		el.innerHTML = markerSvg
		el.style.color = markerColor
		el.style.width = `${markerSize}px`

		el.style["pointer-events"] = "auto"
		el.style.cursor = "pointer"
		el.onclick = () => {
			handleCityClick(data)
		}
		el.onmouseenter = () => {
			handleCityMouseEnter(data)
		}
		el.onmouseleave = () => {
			handleCityMouseLeave(data)
		}
		return el
	}

	const handleCityClick = (d: Feature) => {
		console.log("clicked marker", d)
		if (globeRef.current) {
			setSelectedCity(d as Feature)
			console.log("selected city", d.properties?.name)
			globeRef.current.controls().autoRotate = false
			globeRef.current.pointOfView(
				{
					altitude: INIT_GLOBE.selectedAltitude,
					// @ts-expect-error - ignore
					lng: d.lng,
					// @ts-expect-error - ignore
					lat: d.lat,
				},
				INIT_GLOBE.animDuration
			)
		}
		return null
	}

	const handleCityMouseEnter = (d: object) => {
		if (globeRef.current) {
			globeRef.current.controls().autoRotate = false
		}
	}

	const handleCityMouseLeave = (d: object) => {
		if (globeRef.current && !selectedCity) {
			globeRef.current.controls().autoRotate = true
		}
	}

	const updatedCities =
		cities &&
		(cities
			.map((city) => {
				const alumni = mockAlumni.filter((alumnis) => {
					const cityAlumni = alumnis.address.split(",")[0]
					return (
						cityAlumni.toLowerCase() === city.properties?.name.toLowerCase() &&
						city.properties?.admin1_code &&
						city.properties?.admin1_code ===
							alumnis.address.split(",")[1].trim()
					)
				})
				if (alumni.length > 0) {
					return {
						...city,
						// @ts-expect-error - ignore
						lng: city.lng,
						// @ts-expect-error - ignore
						lat: city.lat,
						size: 10,
					} as Feature
				}
				return null
			})
			.filter((country: any) => country !== null) as Feature[])

	useEffect(() => {
		if (!globeRef?.current) return
		if (globeRef?.current && !selectedCity) {
			console.log("reset globe")
			globeRef.current.controls().autoRotate = true
			globeRef.current.pointOfView(
				{
					lat: 0,
					altitude: INIT_GLOBE.altitude,
				},
				INIT_GLOBE.animDuration
			)
		}
	}, [selectedCity])

	// const handleCountryHover: GlobeProps["onPolygonHover"] = (d) => {
	// 	if (d) {
	// 		if (globeRef?.current) {
	// 			console.log("hovered country", d, globeRef.current.pointOfView())
	// 			setHoveredEarth(true)
	// 			globeRef.current.controls().autoRotate = false
	// 		}
	// 	} else {
	// 		if (selectedCountry) return
	// 		if (globeRef?.current) {
	// 			console.log("reset globe")
	// 			setHoveredEarth(false)
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
	// 					INIT_GLOBE.animDuration
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
	// 					INIT_GLOBE.animDuration
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
	// 				INIT_GLOBE.animDuration
	// 			)
	// 			setSelectedCountry(null)
	// 		}
	// 	}
	// }

	// useEffect(() => {
	// 	if (!globeRef?.current) return
	// 	const resetGlobe = setTimeout(() => {
	// 		if (hoveredEarth && selectedCountry) return
	// 		if (globeRef?.current) {
	// 			console.log("reset globe")
	// 			globeRef.current.controls().autoRotate = true
	// 			globeRef.current.pointOfView(
	// 				{
	// 					lat: 0,
	// 					altitude: 3.4,
	// 				},
	// 				INIT_GLOBE.animDuration
	// 			)
	// 		}
	// 	}, 5000)
	// 	return () => clearTimeout(resetGlobe)
	// }, [hoveredEarth, selectedCountry, globeRef])

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
	// 			INIT_GLOBE.animDuration
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
				atmosphereAltitude={0.15}
				atmosphereColor="#aaa"
				hexPolygonsData={countries?.features}
				hexPolygonResolution={3}
				hexPolygonMargin={0.2}
				hexPolygonUseDots={false}
				onHexPolygonHover={(d) => {
					console.log(d)
				}}
				hexMargin={0.2}
				hexPolygonsTransitionDuration={300}
				hexPolygonColor={(d) => {
					switch (d) {
						case selectedCountry:
							return hexColor
						default:
							return hexColor
					}
				}}
				// hexPolygonAltitude={ polygonAltitude}
				// polygonsData={updatedCountries}
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
				// 			return hexColor
				// 		case selectedCountry:
				// 			return hexColor
				// 		default:
				// 			return hexColor
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
				// onPolygonHover={handleCountryHover}
				// onPolygonClick={handleCountryClick}
				onGlobeClick={() => setSelectedCountry(null)}
				onGlobeReady={onGlobeReady}
				htmlElementsData={updatedCities}
				htmlElement={createMarkerElement}
			/>
		</div>
	)
}

export default SimpleGlobe
