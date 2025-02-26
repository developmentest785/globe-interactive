import { useState } from "react"
import { Upload, Download } from "lucide-react"
import Papa from "papaparse"
import type { Feature } from "geojson"
import type { Alumni } from "@/data/mockAlumni"
import * as GeoJSON from "geojson"

export interface ProcessedCity extends Feature {
	lng: number
	lat: number
	size: number
}
function Converter() {
	const [cities, setCities] = useState<Feature[]>([])
	const [alumni, setAlumni] = useState<Alumni[]>([])
	const [processedData, setProcessedData] = useState<ProcessedCity[]>([])
	const [loading, setLoading] = useState(false)

	const handleCitiesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string)
				setCities(json.features || [])
			} catch (error) {
				alert("Invalid GeoJSON file")
			}
		}
		reader.readAsText(file)
	}

	const handleAlumniUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header) => header.trim(),
			complete: (results) => {
				setAlumni(results.data as Alumni[])
			},
			error: () => {
				alert("Error parsing CSV file")
			},
		})
	}

	const processData = () => {
		console.log("Processing data")
		if (!cities.length || !alumni.length) {
			alert("Please upload both files first")
			return
		}

		console.log("Processing data 2")
		setLoading(true)

		const processed = cities
			.map((city) => {
				const cityAlumni = alumni.filter((alumnus) => {
					if (!alumnus.Address) return false
					return (
						alumnus.Address.split(",")[0].trim().toLowerCase() ===
						city.properties?.name.toLowerCase()
					)
				})

				if (cityAlumni.length > 0) {
					return {
						...city,
						lng: city.geometry?.coordinates[0],
						lat: city.geometry?.coordinates[1],
						size: 10,
					}
				}
				return null
			})
			.filter((city): city is ProcessedCity => city !== null)

		console.log("Setting data", processed.length)
		setProcessedData(processed)
		setLoading(false)
	}

	const downloadProcessedData = () => {
		const dataStr = JSON.stringify(processedData, null, 2)
		const dataBlob = new Blob([dataStr], { type: "application/json" })
		const url = URL.createObjectURL(dataBlob)
		const link = document.createElement("a")
		link.href = url
		link.download = "processed-cities.json"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h1 className="text-2xl font-bold mb-6">Alumni Cities Processor</h1>

					<div className="space-y-6">
						<div>
							<div className="block text-sm font-medium text-gray-700 mb-2">
								Upload Cities GeoJSON
							</div>
							<div className="flex items-center space-x-2">
								<label className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100">
									<Upload className="w-5 h-5 mr-2" />
									<span>Choose GeoJSON</span>
									<input
										type="file"
										accept=".json,.geojson"
										onChange={handleCitiesUpload}
										className="hidden"
									/>
								</label>
								{cities.length > 0 && (
									<span className="text-sm text-green-600">
										✓ {cities.length} cities loaded from file
									</span>
								)}
							</div>
						</div>

						<div>
							<div className="block text-sm font-medium text-gray-700 mb-2">
								Upload Alumni CSV
							</div>
							<div className="flex items-center space-x-2">
								<label className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100">
									<Upload className="w-5 h-5 mr-2" />
									<span>Choose CSV</span>
									<input
										type="file"
										accept=".csv"
										onChange={handleAlumniUpload}
										className="hidden"
									/>
								</label>
								{alumni.length > 0 && (
									<span className="text-sm text-green-600">
										✓ {alumni.length} alumni loaded
									</span>
								)}
							</div>
						</div>

						<button
							type="button"
							onClick={processData}
							disabled={!cities.length || !alumni.length || loading}
							className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{loading ? "Processing..." : "Process Data"}
						</button>

						{processedData.length > 0 && (
							<div className="space-y-4">
								<div className="p-4 bg-gray-50 rounded-lg">
									<h3 className="font-medium mb-2">
										Processed Cities: {processedData.length}
									</h3>
									<pre className="text-sm overflow-auto max-h-40">
										{JSON.stringify(processedData, null, 2)}
									</pre>
								</div>

								<button
									type="button"
									onClick={downloadProcessedData}
									className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
								>
									<Download className="w-5 h-5 mr-2" />
									Download Processed Data
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Converter
