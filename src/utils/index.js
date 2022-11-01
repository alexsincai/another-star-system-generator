import seedrandom from "seedrandom";
import { color } from "./color";

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

//  construct the orbits for the system
export const makeOrbits = (seed, count = 9, inclination = 1 / 6) =>
    Array(count)
        .fill() //  create empty array
        .map((_, i) => Math.pow(1.6, i + 1)) //  fill it with powers of 1.6 (value determined experimentally)
        .map((o, i) => round(o + range(seed + i, -0.3, 0.3))) //  wiggle the distances a bit
        .map((o, i, a) => ({
            distance: o * 2,
            speed: round(a.length / (i + 1)), //  next index (don't divide by 0, kids!) relative to final index
            giant: i >= (a.length - 1) / 2, //  is the planet farther from the sun?
        }))
        .map((o, i, a) => ({
            ...o,
            trail: round(Math.PI * 2 * (o.speed / a[0].speed), 4), //  orbit trail length
        }))
        .map((o, i) => ({
            ...o,
            size: o.giant
                ? round(range(seed + i, 0.8, 1.1)) //  gas giants are bigger
                : round(range(seed + i, 0.3, 0.6)), //  rocky planets are not
            color: o.giant
                ? color(
                      //  lch
                      range(seed + i, 60, 80),
                      range(seed + i + 1, 30, 50),
                      range(seed + i + 2, 180, 300) //  hue is bluish
                  )
                : color(
                      range(seed + i, 60, 80),
                      range(seed + i + 1, 30, 50),
                      range(seed + i + 2, 300, 420) //  pink - red - yellow
                  ),
        }))
        .map((o, i) => ({
            ...o,
            angle: range(seed + o.distance + i, 0, Math.PI * 2),
        })) //  initial orbital position
        .map((o, i) => ({
            ...o,
            orbitInclination: [
                0,
                range(seed + i, -1, 1) * Math.PI * inclination,
                range(seed + i + 1, -1, 1) * Math.PI * inclination,
            ], //  tilt the orbit a bit
        }))
        .sort(() => Math.sign(range(seed, -0.5, 0.5))) //  randomize system
        .slice(0, Math.round(range(seed + 1, Math.ceil(count / 2), count))) //  remove up to half the planets
        .sort((a, b) => Math.sign(a - b)) //  reorder system
        .map((o, i) => ({ ...o, index: i + 1 })); //  add planet indices
