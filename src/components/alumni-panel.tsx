import { Alumni } from "@/data/mockAlumni"
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

	const countryFullName = city.properties?.adm0name

	const countryAlumni = alumni.filter(
		(a) => a.city.toLowerCase() === cityName.toLowerCase()
	)
	if (countryAlumni.length === 0) return null

	return (
		<motion.div
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{ type: "spring", damping: 20 }}
			className="fixed inset-y-1/2 right-0 z-20 my-auto h-fit w-72 -translate-y-1/2 transform overflow-y-auto bg-white shadow-xl"
		>
			<div className="relative p-6">
				<div className="flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-800">
							{`${countryFullName}${countryAlumni.length ? "'s" : ""}`} Alumni
						</h2>
						<button
							onClick={onClose}
							className="absolute right-0 top-2 rounded-full p-2 transition-colors hover:bg-gray-100"
							aria-label="Close panel"
						>
							<X className="h-6 w-6 text-gray-600" />
						</button>
					</div>
					<div className="mb-6 text-sm text-gray-500">
						{countryAlumni.length} alumni from{" "}
						{`${countryFullName} ${countryAlumni.length === 1 ? "is" : "are"}`}
						{} part of our community.
					</div>
				</div>

				<div className="space-y-6">
					{countryAlumni.map((alumnus) => (
						<div
							key={alumnus.id}
							className="rounded-lg bg-gray-50 p-2 shadow-xs transition-shadow hover:shadow-md"
						>
							<img
								src={alumnus.imageUrl}
								alt={alumnus.name}
								className="mb-4 h-32 w-32 rounded-full object-cover"
							/>
							<div className="flex items-start space-x-4">
								<div className="flex-1">
									<h3 className="font-semibold text-gray-800">
										{alumnus.name}
									</h3>
									<p className="text-lg text-gray-600">{alumnus.role}</p>
									<p className="text-lg text-gray-600">{alumnus.company}</p>
									<div className="mt-2 flex items-center space-x-2">
										<span className="text-lg text-gray-500">
											Class of {alumnus.graduationYear}
										</span>
										{alumnus.linkedIn && (
											<a
												href={alumnus.linkedIn}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:text-blue-700"
												aria-label={`Visit ${alumnus.name}'s LinkedIn profile`}
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
