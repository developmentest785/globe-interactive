import { useState } from "react"
import { mockAlumni } from "@/data/mockAlumni"
import { AnimatePresence } from "framer-motion"
import { Maximize, Shrink } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCountryPicker } from "@/hooks/use-country-picker"

import { ColorPicker } from "@/components/ui/color-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import AlumniPanel from "@/components/alumni-panel"
import SimpleGlobe from "@/components/simple-globe"

import sky3 from "@/assets/background_milky_way.jpg"
import sky1 from "@/assets/background.png"
import bg1 from "@/assets/earth-blue-marble.jpg"
import bg2 from "@/assets/earth-dark.jpg"
import bg3 from "@/assets/earth-day.jpg"
import bg4 from "@/assets/earth-night.jpg"
import sky2 from "@/assets/night-sky.png"

function App() {
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
	const [currentBackground, setCurrentBackground] = useState<number>(0)
	const [currentSky, setCurrentSky] = useState<number>(0)
	const [color, setColor] = useState("#0f0f0f")
	const [hexColor, setHexColor] = useState<string>("#0f0f0f")
	const [markerColor, setMarkerColor] = useState<string>("#b03c3c")
	const [markerSize, setMarkerSize] = useState<number>(10)

	const backgrounds = [
		{ name: "background 1", value: bg1 },
		{ name: "background 2", value: bg2 },
		{ name: "background 3", value: bg3 },
		{ name: "background 4", value: bg4 },
	]

	const skys = [
		{ name: "Color", value: "" },
		{ name: "sky 1", value: sky1 },
		{ name: "sky 2", value: sky2 },
		{ name: "sky 3", value: sky3 },
	]

	const { selectedCountry, setSelectedCountry, setHoveredCountry } =
		useCountryPicker()

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
		<div
			className={cn("relative h-screen w-full")}
			style={{ backgroundColor: color }}
		>
			<div className="fixed right-4 top-4 z-10 flex flex-col gap-4 rounded-sm bg-white p-4 text-black">
				<button onClick={handleFullScreen} className="h-10 w-10 self-end">
					{isFullScreen ? <Shrink size={32} /> : <Maximize size={32} />}
				</button>
				<Select
					defaultValue={currentBackground.toString()}
					onValueChange={(value) => setCurrentBackground(Number(value))}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select Background" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Backgrounds</SelectLabel>
							{backgrounds.map((bg, index) => (
								<SelectItem key={index} value={index.toString()}>
									{bg.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select
					defaultValue={currentSky.toString()}
					onValueChange={(value) => setCurrentSky(Number(value))}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select Sky" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Skys</SelectLabel>
							{skys.map((sky, index) => (
								<SelectItem key={index} value={index.toString()}>
									{sky.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				{!currentSky && (
					<div className="flex justify-between">
						<p className="mr-2">Color</p>
						<ColorPicker onChange={setColor} value={color} />
					</div>
				)}
				<div className="flex justify-between">
					<p className="mr-2">Hex Color</p>
					<ColorPicker onChange={setHexColor} value={hexColor} />
				</div>
				<div className="flex justify-between">
					<p className="mr-2">Marker Color</p>
					<ColorPicker onChange={setMarkerColor} value={markerColor} />
				</div>

				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="picture">Marker Size</Label>
					<Input
						type="number"
						value={markerSize}
						onChange={(e) => setMarkerSize(Number(e.target.value))}
					/>
				</div>
			</div>

			{/* background: string
	globeImg: string
	backgroundColor: string */}
			<div className="absolute inset-0">
				<SimpleGlobe
					background={skys[currentSky].value}
					backgroundColor={color}
					globeImg={backgrounds[currentBackground].value}
					hexColor={hexColor}
					markerColor={markerColor}
					markerSize={markerSize}
				/>
			</div>

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
