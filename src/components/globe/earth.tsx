import { useEffect, useRef } from 'react';

import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { useCountryPicker } from '@/hooks/use-country-picker';
import { TrackballControls } from 'three/examples/jsm/Addons.js';

export default function Earth() {
  const divRef = useRef<HTMLDivElement>(null);
  const { countries } = useCountryPicker();
  useEffect(() => {
    if (!divRef.current) return;
    if (!countries) return;

    const Globe = new ThreeGlobe()
      .globeImageUrl(
        '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      )
      .polygonsData(
        countries.features.filter(
          (d) => d.properties && d.properties.ISO_A2 !== 'AQ'
        )
        // countries.features
      )
      .polygonCapColor(() => 'rgba(0, 0, 0, 0)')
      .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
      .polygonStrokeColor(() => 'rgba(255, 0, 0, 0.7)');

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    divRef.current?.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.8));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      // tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();

    return () => {
      divRef.current?.removeChild(renderer.domElement);
    };
  }, [divRef, countries]);

  return <div id="globeViz" ref={divRef}></div>;
}
