import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { makeOrbits, range, round } from "../utils";

import Sphere from "./Sphere";
import Ring from "./Ring";

const Planet = ({
    distance,
    speed,
    giant,
    size,
    color,
    angle,
    orbitInclination,
    trail,
    index,
    seed,
    total,
    orbits = false,
    moons = false,
}) => {
    const displacer = useRef(null);
    const rotator = useRef(null);

    useFrame((state, delta) => {
        angle += delta * speed * 0.5;
        rotator.current?.rotation.set(0, angle, 0);

        displacer.current?.position.set(distance, 0, 0);
        displacer.current?.rotation.set(...orbitInclination);
    });

    const hasRing =
        giant && range(seed + distance, 0, 1) > 0.6 && distance > 45;

    moons = moons && !hasRing && distance > 30;
    const satellites = makeOrbits(
        seed,
        round(range(seed, 1, index), 0),
        1 / 6
    ).map((satellite) => ({
        ...satellite,
        giant: false,
        size: range(seed + satellite.index + index, 0, size),
        speed: satellite.speed * total * 0.8,
    }));

    return (
        <group ref={rotator}>
            <group ref={displacer}>
                <Sphere size={size} color={color} />

                {hasRing ? (
                    <Ring
                        seed={seed + distance}
                        inclination={orbitInclination}
                        size={size}
                        color={color}
                    />
                ) : null}

                {moons
                    ? satellites.map((s, i) => (
                          <Planet
                              key={i}
                              {...s}
                              seed={seed + i}
                              total={satellites.length}
                              orbits={orbits}
                          />
                      ))
                    : null}
            </group>

            {orbits ? (
                <mesh rotation={[Math.PI / 2, 0, Math.PI / 24]}>
                    <torusBufferGeometry
                        args={[distance, 0.0125, 4, 360, trail]}
                        attach="geometry"
                    />
                    <meshPhongMaterial color="#cccccc" attach="material" />
                </mesh>
            ) : null}
        </group>
    );
};

export default Planet;
