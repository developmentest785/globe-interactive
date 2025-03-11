import { mockAlumni } from "@/data/mockAlumni";
import { AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Maximize, Shrink } from "lucide-react";
import { useState } from "react";

import { useCountryPicker } from "@/hooks/use-country-picker";
import { cn } from "@/lib/utils";

import AlumniPanel from "@/components/alumni-panel";
import SimpleGlobe from "@/components/simple-globe";
import Converter from "@/components/csv-to-json-converter";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import sky1 from "@/assets/background.png";
import sky3 from "@/assets/background_milky_way.jpg";
import bg1 from "@/assets/earth-blue-marble.jpg";
import bg2 from "@/assets/earth-dark.jpg";
import bg3 from "@/assets/earth-day.jpg";
import bg4 from "@/assets/earth-night.jpg";
import sky2 from "@/assets/night-sky.png";
import { Switch } from "./components/ui/switch";

interface Preset {
  name: string;
  sky: number;
  background: number;
  color: string;
  hexColor: string;
  markerColor: string;
  markerSize: number;
}

function App() {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [currentBackground, setCurrentBackground] = useState<number>(0);
  const [currentSky, setCurrentSky] = useState<number>(0);
  const [color, setColor] = useState("#0f0f0f");
  const [hexColor, setHexColor] = useState<string>("#0f0f0f");
  const [markerColor, setMarkerColor] = useState<string>("#b03c3c");
  const [markerSize, setMarkerSize] = useState<number>(20);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [convertedOpen, setConvertedOpen] = useState<boolean>(false);

  const { selectedCity, setHoveredCity, setSelectedCity } = useCountryPicker();
  const presets: Preset[] = [
    {
      name: "Preset 1",
      sky: 2,
      background: 0,
      color: "#0f0f0f",
      hexColor: "#0f0f0f",
      markerColor: "#b03c3c",
      markerSize: 20,
    },
    {
      name: "Preset 2",
      sky: 1,
      background: 1,
      color: "#0f0f0f",
      hexColor: "#d2d2d2",
      markerColor: "#ff0909",
      markerSize: 20,
    },
    {
      name: "Preset 3",
      sky: 2,
      background: 3,
      color: "#0f0f0f",
      hexColor: "#044949",
      markerColor: "#ff6a6a",
      markerSize: 20,
    },
    {
      name: "Preset 4",
      sky: 1,
      background: 0,
      color: "#0f0f0f",
      hexColor: "#ff6a6a",
      markerColor: "#ff0909",
      markerSize: 12,
    },
  ];

  const backgrounds = [
    { name: "Blue Marble", value: bg1 },
    { name: "Black Matte", value: bg2 },
    { name: "Skt blue", value: bg3 },
    { name: "Night Blue", value: bg4 },
  ];

  const skys = [
    { name: "Solid Color", value: "" },
    { name: "sky 1", value: sky1 },
    { name: "sky 2", value: sky2 },
    { name: "sky 3", value: sky3 },
  ];

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      document.body.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  return (
    <div
      className={cn("relative h-screen w-full")}
      style={{ backgroundColor: color }}
    >
      <div className="fixed left-4 top-4 z-10 flex flex-col gap-2 rounded-sm pt-2 bg-primary text-primary-foreground">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mb-4 flex items-center justify-between space-x-4 px-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Change Globe values <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <button
              type="button"
              onClick={handleFullScreen}
              className="h-10 w-10 self-end"
            >
              {isFullScreen ? <Shrink size={32} /> : <Maximize size={32} />}
            </button>
          </div>
          <CollapsibleContent className="space-y-2 px-4 pb-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="background" className="text-sm">
                Background
              </Label>
              <Select
                name="background"
                value={currentBackground.toString()}
                defaultValue={currentBackground.toString()}
                onValueChange={(value) => setCurrentBackground(Number(value))}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select Background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Backgrounds</SelectLabel>
                    {backgrounds.map((bg, index) => (
                      // biome-ignore lint: not unique
                      <SelectItem key={index} value={index.toString()}>
                        {bg.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="sky" className="text-sm">
                Sky
              </Label>
              <Select
                value={currentSky.toString()}
                defaultValue={currentSky.toString()}
                onValueChange={(value) => setCurrentSky(Number(value))}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select Sky" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Skys</SelectLabel>
                    {skys.map((sky, index) => (
                      // biome-ignore lint: not unique
                      <SelectItem key={index} value={index.toString()}>
                        {sky.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {!currentSky && (
              <div className="flex items-center justify-between">
                <p className="mr-2 text-sm">
                  Color <span className="text-xs">{color}</span>
                </p>
                <ColorPicker onChange={setColor} value={color} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="mr-2 text-sm">
                Hex Color <span className="text-xs">{hexColor}</span>
              </p>
              <ColorPicker onChange={setHexColor} value={hexColor} />
            </div>
            <div className="flex items-center justify-between">
              <p className="mr-2 text-sm">
                Marker Color <span className="text-xs">{markerColor}</span>
              </p>
              <ColorPicker onChange={setMarkerColor} value={markerColor} />
            </div>
            <div className="grid w-full max-w-xs items-center gap-1.5">
              <Label htmlFor="picture">Marker Size</Label>
              <Input
                type="number"
                value={markerSize}
                className="w-44"
                onChange={(e) => setMarkerSize(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Switch
                id="converter"
                checked={convertedOpen}
                onCheckedChange={() => setConvertedOpen(!convertedOpen)}
              />
              <Label htmlFor="converter" className="text-sm">
                Convert CSV to JSON
              </Label>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="sky" className="text-sm">
                Preset
              </Label>
              <Select
                value={selectedPreset.toString()}
                defaultValue={selectedPreset.toString()}
                onValueChange={(value) => {
                  setCurrentSky(presets[Number(value)].sky);
                  setCurrentBackground(presets[Number(value)].background);
                  setColor(presets[Number(value)].color);
                  setHexColor(presets[Number(value)].hexColor);
                  setMarkerColor(presets[Number(value)].markerColor);
                  setMarkerSize(presets[Number(value)].markerSize);
                  setSelectedPreset(Number(value));
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="selected Preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Skys</SelectLabel>
                    {presets.map((preset, index) => (
                      // biome-ignore lint: not unique
                      <SelectItem key={index} value={index.toString()}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedCity && (
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs">Selected City</h3>
                <p className="text-sm">
                  {selectedCity.properties?.name},{" "}
                  {selectedCity.properties?.adm0name}
                </p>
              </div>
            )}
            <pre>
              <code className="whitespace-pre-wrap text-gray-500 text-xs">
                {JSON.stringify(
                  {
                    currentBackground,
                    currentSky,
                    color,
                    hexColor,
                    markerColor,
                    markerSize,
                  },
                  null,
                  2,
                )}
              </code>
            </pre>{" "}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="absolute inset-0 z-0">
        {convertedOpen ? (
          <Converter />
        ) : (
          <SimpleGlobe
            background={skys[currentSky].value}
            backgroundColor={color}
            globeImg={backgrounds[currentBackground].value}
            hexColor={hexColor}
            markerColor={markerColor}
            markerSize={markerSize}
          />
        )}
      </div>

      {selectedCity?.properties?.name && (
        <AnimatePresence>
          <AlumniPanel
            key="panel"
            city={selectedCity}
            alumni={mockAlumni}
            onClose={() => {
              setSelectedCity(null);
              setHoveredCity(null);
            }}
          />
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;
