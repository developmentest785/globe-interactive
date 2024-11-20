import React, { useRef, useLayoutEffect } from 'react';
import { extend } from '@react-three/fiber';
import Globe, { GlobeMethods, GlobeProps } from 'react-globe.gl';

extend({ Globe });

const Earth = React.forwardRef<GlobeMethods, GlobeProps>(
  ({ ...props }, ref) => {
    const localRef = useRef<GlobeMethods>();

    useLayoutEffect(() => {
      if (localRef.current && ref) {
        if (typeof ref === 'function') {
          ref(localRef.current);
        } else {
          ref.current = localRef.current;
        }
      }
    }, [ref]);

    return <Globe ref={localRef} {...props} />;
  }
);
Earth.displayName = 'Earth';

// const Earth = (props: Props) => {
//   // This reference will give us direct access to the ThreeGlobe class
//   const globeRef = useRef<ThreeGlobe>(null);

//   // An effect that runs after three.js elements are created but before render
//   useLayoutEffect(() => {
//     // Configure the globe
//     if (!globeRef.current) return;
//     globeRef.current.globeImageUrl(
//       '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
//     );
//     globeRef.current.bumpImageUrl(
//       '//unpkg.com/three-globe/example/img/earth-topology.png'
//     );
//   }, []);

//   if (!globeRef.current) return null;
//   // This is a ThreeGlobe object but represented in JSX.
//   // Any valid properties of that class are valid props
//   return <threeGlobe {...props} ref={globeRef} />;
// };

export default Earth;
