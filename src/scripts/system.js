import { Group } from "three";
import { Orbit, randomPastel, range, round, Sphere } from "./utils";

const memo = {
    0: 1,
    1: 2,
};

const fibonacci = (number) => {
    if (memo[number] !== undefined) return memo[number];
    const value = fibonacci(number - 1) + fibonacci(number - 2);
    memo[number] = value;
    return value;
};

export class System {
    constructor(seed, size, orbits, animation, hasMoons = true) {
        this.seed = seed;
        this.size = size;
        this.orbits = orbits;
        this.animation = animation;
        this.hasMoons = hasMoons;

        this.construct();
    }

    construct() {
        this.group = new Group();

        this.star = Sphere(this.size * 0.8, 0xffdd33, true);
        this.group.add(this.star);

        this.planets = [];

        const values = new Array(fibonacci(this.size))
            .fill()
            .map((_, i) => fibonacci(i))
            .map((d) => ({
                distance: d * this.size,
                scale: `${d}`.length,
            }))
            .map((p, i, a) => ({
                ...p,
                size: round(range(this.seed + i, p.scale * 0.4, p.scale * 0.8)),
                speed: a.length / (i + 1),
                angle: range(this.seed + i, 0, Math.PI * 2),
                inclination: range(
                    this.seed + i * 2,
                    Math.PI / -24,
                    Math.PI / 24
                ),
            }))
            .map((p) => (this.hasMoons ? p : { ...p, size: p.size * 0.4 }))
            .map((p, i) => {
                if (!this.hasMoons) return p;
                if (this.scale === 1) return p;

                const moons = new System(
                    Math.pow(this.seed, 2),
                    Math.round(
                        range(this.seed + i, p.size * 0.2, p.size * 0.8)
                    ) * 2,
                    this.orbits,
                    this.animation,
                    false
                );

                return {
                    ...p,
                    moons: moons,
                };
            });

        this.data = values;

        values.forEach((p, i) => {
            const offset = p.distance * 5;

            const tiltGroup = new Group();
            tiltGroup.rotation.x = p.inclination;
            this.group.add(tiltGroup);

            const orbitGroup = new Group();
            orbitGroup.rotation.y = p.angle;
            tiltGroup.add(orbitGroup);

            const planet = Sphere(p.size, randomPastel(this.seed + i, 0, 360));
            planet.position.x = offset;
            orbitGroup.add(planet);

            if (p.moons) {
                orbitGroup.add(p.moons.group);
                p.moons.group.position.x = offset;
            }

            if (this.orbits) {
                const orbit = Orbit(offset, this.size);
                orbitGroup.add(orbit);
            }

            this.planets.push(orbitGroup);
        });
    }

    update(delta) {
        this.planets.forEach((p, i) => {
            const o = this.data[i];
            p.rotation.y = o.angle + o.speed * delta * this.animation * 0.00001;

            if (o.moons) {
                o.moons.update(delta);
            }
        });
    }
}
