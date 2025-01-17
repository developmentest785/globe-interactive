import { createElement } from "react"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import R3FGlobe, { GlobeProps, type GlobeMethods } from "r3f-globe"

import { WebGLRendererConfig } from "@/lib/three-utils"
import { useCountryPicker } from "@/hooks/use-country-picker"

import bg3 from "@/assets/earth-dark.jpg"
import bump from "@/assets/earth-topology.png"

export type MarkerGlobeProps = object

type FCwithRef<P = object, R = object> = React.FunctionComponent<
	P & { ref?: React.MutableRefObject<R | undefined> }
>

const Globe: FCwithRef<GlobeProps, GlobeMethods> = (props) => {
	const { countries, cities } = useCountryPicker()

	const markerSvg = `<svg viewBox="-4 0 36 36">
	  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
	  <circle fill="black" cx="14" cy="14" r="7"></circle>
	</svg>`

	if (!countries || !cities) {
		return null
	}

	const countriesData = countries.features.map((country) => {
		console.log(country)
		return {
			...country,
			color: "red",
		}
	})
	const citiesData = cities.features.map((city) => {
		console.log(city)
		return {
			...city,
			// lng: city.properties?.longitude,
			// lat: city.properties?.latitude,
			size: 7 + Math.random() * 30,
			// color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
		}
	})

	const htmlElement = (d) => {
		const el = document.createElement("div")
		// // console.log(d)
		el.innerHTML = markerSvg
		// el.style.color = d.color
		el.style.width = `${d.size}px`

		// el.style["pointer-events"] = "auto"
		el.style.cursor = "pointer"
		// el.onclick = () => console.info(d)
		return el
	}

	const polygonAltitude = (d) => {
		// console.log(d)
		return 0
	}

	return createElement(R3FGlobe, {
		...props,
		showGraticules: true,
		globeImageUrl: bg3,
		hexPolygonsData: countriesData,
		hexPolygonResolution: 3,
		hexPolygonMargin: 0.2,
		hexPolygonUseDots: false,
		hexBinPointWeight: 3,
		hexBinResolution: 2,
		hexPolygonAltitude: polygonAltitude,
		hexMargin: 0.2,
		hexTopColor: () => "rgba(255,255,255,1)",
		hexSideColor: () => "rgba(0,255,0,0.5)",
		showAtmosphere: true,
		atmosphereColor: "#aaa",
		htmlElementsData: citiesData,
		htmlElement: htmlElement,
	})
}

const MarkerGlobe: React.FC<MarkerGlobeProps> = () => {
	return (
		<Canvas>
			<WebGLRendererConfig />
			<PerspectiveCamera
				makeDefault
				fov={50}
				position={[0, 0, 300]}
				aspect={1.2}
				near={180}
				far={1800}
			/>
			<directionalLight intensity={0.8 * Math.PI} />
			<OrbitControls
				enablePan={false}
				enableZoom={true}
				minDistance={300}
				maxDistance={1000}
				autoRotateSpeed={1}
				autoRotate={true}
				minPolarAngle={Math.PI / 3.5}
				maxPolarAngle={Math.PI - Math.PI / 3}
			/>
			<color attach="background" args={["#000"]} />
			<ambientLight intensity={0.5} />
			<Globe />
		</Canvas>
	)
}

export default MarkerGlobe
