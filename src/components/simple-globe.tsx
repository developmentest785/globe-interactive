import { mockAlumni } from "@/data/mockAlumni";
import type { Feature } from "geojson";
import { useEffect, useRef } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";

import { useCountryPicker } from "@/hooks/use-country-picker";
import useViewport from "@/hooks/useViewport";
import { cn } from "@/lib/utils";

import cloudImg from "@/assets/clouds.png";
import bump from "@/assets/earth-topology.png";

interface SimpleGlobeProps extends React.HTMLProps<HTMLDivElement> {
  background: string;
  globeImg: string;
  markerSize: number;
  hexColor: string;
  onGlobeReset?: () => void;
  onUserInteraction?: () => void;
}

function SimpleGlobe({
  background,
  globeImg,
  markerSize,
  onGlobeReset,
  onUserInteraction,
  className,
}: SimpleGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { cities, selectedCity, setSelectedCity } = useCountryPicker();
  const { width, height } = useViewport();

  const INIT_GLOBE = {
    lat: 0,
    lng: 0,
    altitude: 3.1,
    selectedAltitude: 3.1,
    animDuration: 1500,
  };

  const onGlobeReady = () => {
    const globe = globeRef.current;
    if (globe) {
      console.log("globe ready");
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.3;

      const directionalLight = globe
        .lights()
        .find((obj3d) => obj3d.type === "DirectionalLight");

      if (directionalLight) {
        directionalLight.position.set(0, 250, 150);
        directionalLight.intensity = 15;
      }

      // Add clouds sphere
      const CLOUDS_ALT = 0.004;
      const CLOUDS_ROTATION_SPEED = -0.01; // deg/frame

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
        );
        globe.scene().add(clouds);
        (function rotateClouds() {
          clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
          requestAnimationFrame(rotateClouds);
        })();
      });
    }
  };

  // @ts-ignore
  const createMarkerElement = (d: object) => {
    const data = d as Feature;

    const el = document.createElement("div") as HTMLDivElement;
    // el.innerHTML = markerSvg;
    el.style.width = `${markerSize}px`;
    el.style["pointer-events"] = "auto";
    el.style.position = "relative";
    el.style.cursor = "pointer";

    const img = document.createElement("img") as HTMLImageElement;
    img.src = "purdue-logo/logo-1.png";
    img.style.width = `${markerSize}px`;
    img.style.objectFit = "contain";

    el.appendChild(img);

    el.onclick = () => {
      handleCityClick(data);
    };
    el.onmouseenter = () => {
      handleCityMouseEnter(data);
    };
    el.onmouseleave = () => {
      handleCityMouseLeave(data);
    };
    return el;
  };

  const handleCityClick = (d: Feature) => {
    console.log("clicked marker", d);
    if (globeRef.current) {
      setSelectedCity(d as Feature);
      onUserInteraction?.();
      console.log("selected city", d.properties?.name);
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView(
        {
          // @ts-expect-error - ignore
          lng: d.lng,
          // @ts-expect-error - ignore
          lat: d.lat,
        },
        INIT_GLOBE.animDuration
      );
    }
    return null;
  };

  const handleCityMouseEnter = (_d: object) => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      onUserInteraction?.();
    }
  };

  const handleCityMouseLeave = (_d: object) => {
    if (globeRef.current && !selectedCity) {
      globeRef.current.controls().autoRotate = true;
      onUserInteraction?.();
    }
  };

  const updatedCities =
    cities &&
    (cities
      .map((city) => {
        const alumni = mockAlumni.filter((alumnis) => {
          const cityAlumni = alumnis.address.split(",")[0];
          return (
            cityAlumni.toLowerCase() === city.properties?.name.toLowerCase() &&
            city.properties?.admin1_code &&
            city.properties?.admin1_code ===
              alumnis.address.split(",")[1].trim()
          );
        });
        if (alumni.length > 0) {
          return {
            ...city,
            // @ts-expect-error - ignore
            lng: city.lng,
            // @ts-expect-error - ignore
            lat: city.lat,
            size: 10,
          } as Feature;
        }
        return null;
      })
      .filter((country: any) => country !== null) as Feature[]);

  useEffect(() => {
    if (!globeRef?.current) return;
    if (globeRef?.current && !selectedCity) {
      console.log("reset globe");
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointOfView(
        {
          lat: 0,
          altitude: INIT_GLOBE.altitude,
        },
        INIT_GLOBE.animDuration
      );
      onGlobeReset?.();
    }
  }, [selectedCity]);

  return (
    <div className={cn("relative", className)}>
      <Globe
        ref={globeRef}
        animateIn={false}
        backgroundImageUrl={background}
        globeImageUrl={globeImg}
        bumpImageUrl={bump}
        width={(window.innerWidth | width) - 32}
        height={(window.innerHeight | height) - 32}
        waitForGlobeReady={true}
        atmosphereAltitude={0.15}
        atmosphereColor="#aaa"
        onGlobeClick={() => {
          onUserInteraction?.();
        }}
        onGlobeReady={onGlobeReady}
        htmlElementsData={updatedCities || []}
        htmlElement={createMarkerElement}
      />
    </div>
  );
}

export default SimpleGlobe;
