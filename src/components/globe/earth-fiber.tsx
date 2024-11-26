import { Suspense, useEffect, useRef } from "react"
import background from "@/assets/earth-dark.jpg"
import sky from "@/assets/night-sky.png"
import { useTexture } from "@react-three/drei"
import { Canvas, extend, Object3DNode, useThree } from "@react-three/fiber"
import { Feature } from "geojson"
import * as THREE from "three"
import ThreeGlobe from "three-globe"

declare module "@react-three/fiber" {
	interface ThreeElements {
		threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>
	}
}

extend({ ThreeGlobe })

// type Position = {
// 	order: number
// 	startLat: number
// 	startLng: number
// 	endLat: number
// 	endLng: number
// 	arcAlt: number
// 	color: string
// }

export type GlobeConfig = {
	pointSize?: number
	globeColor?: string
	showAtmosphere?: boolean
	atmosphereColor?: string
	atmosphereAltitude?: number
	emissive?: string
	emissiveIntensity?: number
	shininess?: number
	polygonColor?: string
	ambientLight?: string
	directionalLeftLight?: string
	directionalTopLight?: string
	pointLight?: string
	arcTime?: number
	arcLength?: number
	rings?: number
	maxRings?: number
	initialPosition?: {
		lat: number
		lng: number
	}
	autoRotate?: boolean
	autoRotateSpeed?: number
}

interface WorldProps {
	globeRef: React.MutableRefObject<ThreeGlobe | null>
	globeConfig: GlobeConfig
	data: Feature[]
}
export function Globe({ globeConfig, data, globeRef }: WorldProps) {
	const defaultProps = {
		pointSize: 1,
		atmosphereColor: "#aaa",
		showAtmosphere: true,
		atmosphereAltitude: 0.1,
		polygonColor: "rgba(255,255,255,0.7)",
		globeColor: "#1d072e",
		...globeConfig,
	}

	// const [globeData, setGlobeData] = useState<
	// 	| {
	// 			size: number
	// 			order: number
	// 			color: (t: number) => string
	// 			lat: number
	// 			lng: number
	// 	  }[]
	// 	| null
	// >(null)

	useEffect(() => {
		if (globeRef.current) {
			globeRef.current
				.showAtmosphere(defaultProps.showAtmosphere)
				.polygonsData(data)
				.polygonsTransitionDuration(300)
				.polygonAltitude(0.01)
				.polygonStrokeColor("#666")
				.polygonSideColor("transparent")
				.globeImageUrl(background)
		}
	})

	return <threeGlobe ref={globeRef} />
}

export function WebGLRendererConfig() {
	const { gl, size } = useThree()

	useEffect(() => {
		gl.setPixelRatio(window.devicePixelRatio)
		gl.setSize(size.width, size.height)
		gl.setClearColor(0xffaaff, 0)
	}, [])

	return null
}

interface BackgroundProps {
	object?: THREE.Texture
}
const Background = (props?: BackgroundProps) => {
	const { gl } = useThree()

	const skyImage = useTexture(sky)
	const formatted = new THREE.WebGLCubeRenderTarget(
		skyImage.image.height
	).fromEquirectangularTexture(gl, skyImage)
	return <primitive {...props} attach="background" object={formatted.texture} />
}

const EarthFiber = (
	{ data }: { data: Feature[] },
	{ globeConfig }: { globeConfig: GlobeConfig }
) => {
	const globeRef = useRef<ThreeGlobe>(null)

	return (
		<Canvas>
			<Suspense fallback={null}>
				<Background />
			</Suspense>

			<WebGLRendererConfig />
			<ambientLight intensity={0.1} />
			<pointLight position={[2, 3, 1]} />
			<mesh>
				<Globe globeRef={globeRef} data={data} globeConfig={globeConfig} />
			</mesh>
		</Canvas>
	)
}
EarthFiber.displayName = "EarthFiber"
export default EarthFiber
