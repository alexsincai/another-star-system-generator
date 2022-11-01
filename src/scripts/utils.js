import seedrandom from "seedrandom";
import Color from "colorjs.io";
import {
    MeshLambertMaterial,
    Mesh,
    TorusBufferGeometry,
    IcosahedronGeometry,
} from "three";

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

//  get a handom pastel color (random hue, low saturation, high lightness)
export const randomPastel = (seed, min = 0, max = 360) =>
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

//  build a sphere mesh
export const Sphere = (radius = 1, color = 0xdddddd, emit = false) => {
    const object = new Mesh(
        new IcosahedronGeometry(radius, 3),
        new MeshLambertMaterial({
            wireframe: false,
            color,
            emissive: emit ? color : 0x000000,
        })
    );
    return object;
};

//  build a torus mesh
export const Orbit = (radius = 1, size = 1, start = 0, end = Math.PI * 2) => {
    const color = 0x888888;
    const object = new Mesh(
        new TorusBufferGeometry(radius, size / 50, 16, 360, end + start),
        new MeshLambertMaterial({
            wireframe: false,
            color: color,
        })
    );

    object.rotation.x = Math.PI / 2;
    object.rotation.z = start;

    return object;
};
