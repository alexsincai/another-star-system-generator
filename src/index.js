import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { makeOrbits } from "./utils";

import "the-new-css-reset/css/reset.css";
import "./styles/index.css";
import Planet from "./components/Planet";
import Star from "./components/Star";

const StarSystem = () => {
    const [seed, setSeed] = useState(25);
    const [planets, setPlanets] = useState(makeOrbits(seed, 9, 1 / 360));
    const [orbits, setOrbits] = useState(true);

    useEffect(() => {
        setPlanets(makeOrbits(seed, 9, 1 / 360));
    }, [seed]);

    const cameraDistance = Math.round(
        planets[planets.length - 1].distance * 1.1
    );

    console.log(planets)
    return (
        <StrictMode>
            <aside>
                <label>
                    Random seed: {seed}
                    <input
                        type="range"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                    />
                </label>
                <label>
                    {orbits ? "Hide" : "Show"} orbits
                    <input
                        type="checkbox"
                        checked={orbits}
                        onChange={() => setOrbits(!orbits)}
                    />
                </label>
            </aside>
            <main>
                <Canvas
                    width="100%"
                    height="100%"
                    camera={{
                        position: [0, 5, cameraDistance],
                    }}>
                    <ambientLight intensity="0.5" color="#2e386b" />
                    <directionalLight intensity="0.5" position={[-2, 2, 1.5]} />

                    <Star color="#ffcc88" />

                    {planets.map((p, i) => (
                        <group key={i} rotation={p.orbitInclination}>
                            <Planet
                                {...p}
                                seed={seed}
                                total={planets.length}
                                orbits={orbits}
                                moons={true}
                            />
                        </group>
                    ))}

                    <OrbitControls />

                    <EffectComposer>
                        <Bloom
                            intensity="1"
                            luminanceThreshold="0.5"
                            luminanceSmoothing="1"
                        />
                    </EffectComposer>
                </Canvas>
            </main>
        </StrictMode>
    );
};

createRoot(document.getElementById("root")).render(<StarSystem />);
