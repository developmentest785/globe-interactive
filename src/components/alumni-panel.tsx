import type { Alumni } from "@/data/mockAlumni"
import { motion } from "framer-motion"
import type { Feature } from "geojson"
import { Linkedin, X } from "lucide-react"

interface AlumniPanelProps {
	city: Feature | null
	alumni: Alumni[]
	onClose: () => void
}

export default function AlumniPanel({
	city,
	alumni,
	onClose,
}: AlumniPanelProps) {
	if (!city) return null

	const cityName = city.properties?.name
	if (!cityName) return null

	const cityAlumni = alumni.filter((alumnis) => {
		const cityAlumni = alumnis.address.split(",")[0]
		return (
			cityAlumni.toLowerCase() === city.properties?.name.toLowerCase() &&
			city.properties?.admin1_code &&
			city.properties?.admin1_code === alumnis.address.split(",")[1].trim()
		)
	})
	if (cityAlumni.length === 0) return null

	return (
		<motion.div
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{ type: "spring", damping: 20 }}
			className="fixed inset-y-1/2 right-0 z-20 h-fit max-h-[80%] w-72 -translate-y-1/2 transform overflow-y-auto bg-white shadow-xl"
		>
			<div className="relative p-6">
				<div className="flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-800">
							({cityAlumni.length}){`${cityName}${cityName.length ? "'s" : ""}`}{" "}
							Alumni
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="absolute right-0 top-2 rounded-full p-2 transition-colors hover:bg-gray-100"
							aria-label="Close panel"
						>
							<X className="h-6 w-6 text-gray-600" />
						</button>
					</div>
				</div>

				<div className="space-y-6">
					{cityAlumni.map((alumnis) => (
						<div
							key={`${alumnis.first} ${alumnis.last} - ${alumnis.title} -${alumnis.gradYear}`}
							className="rounded-lg bg-gray-50 p-2 shadow-xs transition-shadow hover:shadow-md"
						>
							{alumnis.imageUrl && (
								<img
									src={alumnis.imageUrl}
									alt={alumnis.first}
									className="mb-4 h-32 w-32 rounded-full object-cover"
								/>
							)}
							<div className="flex items-start space-x-4">
								<div className="flex-1">
									<h3 className="font-semibold text-gray-800">
										{alumnis.first} {alumnis.last}
									</h3>
									<p className="text-lg text-gray-600">{alumnis.title}</p>
									<p className="text-lg text-gray-600">{alumnis.company}</p>
									<div className="mt-2 flex items-center space-x-2">
										<span className="text-lg text-gray-500">
											Class of {alumnis.gradYear}
										</span>
										{alumnis.linkedIn && (
											<a
												href={alumnis.linkedIn}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:text-blue-700"
												aria-label={`Visit ${alumnis.first}'s LinkedIn profile`}
											>
												<Linkedin className="h-4 w-4" />
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	)
}
