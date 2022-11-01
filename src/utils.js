import seedrandom from "seedrandom";
import { MeshLambertMaterial, SphereGeometry, Mesh } from "three";
import Color from "colorjs.io";

//  round value v to precision dec
export const round = (v, dec = 3) =>
    Math.floor(v * Math.pow(10, dec)) / Math.pow(10, dec);

//  map value v from range [fromMin - fromMax] to range [toMin - toMax]
export const mapRange = (value, fromMin, fromMax, toMin, toMax) => {
    const input = fromMax - fromMin;
    const output = toMax - toMin;
    const valueScaled = (value - fromMin) / input;
    return toMin + valueScaled * output;
};

//  map a seeded random number to range [min - max)
export const range = (seed, min = 0, max = 1) =>
    mapRange(seedrandom(seed)(), 0, 1, min, max);

//  return [x,y,z] from distance, horizontalAngle, verticalAngle, optional center
export const calculatePosition = (rho, phi, theta, center = [0, 0, 0]) => [
    rho * Math.cos(phi) * Math.sin(theta) + center[0],
    rho * Math.sin(phi) + center[1],
    rho * Math.cos(phi) * Math.cos(theta) + center[2],
];

export const randomPastel = (seed, min=0, max=360) =>
    Number(
        new Color("lch", [
            range(seed, 70, 90),
            range(seed + 1, 30, 60),
            range(seed + 2, min, max),
        ])
            .to("srgb")
            .toString({ format: "hex" })
            .replace("#", "0x")
    );

export const Sphere = (radius = 1, color = 0xdddddd, center = [0, 0, 0]) => {
    const object = new Mesh(
        new SphereGeometry(radius, 32, 64),
        new MeshLambertMaterial({ color })
    );
    object.position.set(...center);
    return object;
};
