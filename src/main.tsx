import { createRoot } from "react-dom/client"

import "./index.css"

import { CountryPickerProvider } from "@/hooks/use-country-picker.tsx"

import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
	<CountryPickerProvider>
		<App />
	</CountryPickerProvider>
)
