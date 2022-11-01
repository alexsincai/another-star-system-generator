import { range, round } from "../utils";

const Ring = ({ seed, inclination, size, color }) => {
    const scale = round(range(seed, 2, 3) * size, 4);
    const thick = round(range(seed, 0.25, 1.25), 4);
    const tilt = [Math.PI / 2, ...inclination.slice(1)];

    return (
        <mesh rotation={tilt} scale={[1, 1, 0.05]}>
            <torusBufferGeometry
                args={[scale, thick, 16, 360]}
                attach="geometry"
            />
            <meshPhongMaterial color={color} attach="material" />
        </mesh>
    );
};

export default Ring;
