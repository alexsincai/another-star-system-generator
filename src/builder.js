import { mapRange, randomPastel, range, round } from "./utils";

const fibs = {};

const fibonacci = (n) => {
    if (n === 0) return 1;
    if (n === 1) return 2;
    if (fibs[n]) return fibs[n];

    const result = fibonacci(n - 1) + fibonacci(n - 2);
    fibs[n] = result;
    return result;
};

export const systemBuilder = (
    scale,
    seed = 1,
    limit = null,
    children = true,
    isChild = false,
    parentSpeed = 1
) => {
    const count = Math.round(Math.pow(2, scale));

    if (isNaN(count)) return null;

    let output = Array(count)
        .fill()
        .map((_, i) => fibonacci(i))
        .map((d, i, a) => ({
            rho: round(scale * (d + range(seed + i, -0.3, 0.3)), 4),
            size: round(
                mapRange(i, 0, a.length - 1, scale * 0.1, scale * 0.9),
                3
            ),
            speed: round(a.length / (i + 1), 3),
        }))
        .map((d, i) => ({
            ...d,
            color: randomPastel(seed + i),
        }));

    if (isChild)
        output = output.map((d) => ({
            ...d,
            speed: round((d.speed * parentSpeed) / d.size, 3),
        }));

    if (!!limit) {
        const cans = output.map(
            (d, i, a) => a[i === 0 ? i + 1 : i - 1].rho !== null
        );
        output = output.map((d, i, a) => ({
            ...d,
            limit: cans[i]
                ? Math.abs(
                      round((a[i === 0 ? i + 1 : i - 1].rho - d.rho) / 2, 4)
                  )
                : null,
        }));
    }

    if (children)
        output = output.map((d, i) => ({
            ...d,
            children: systemBuilder(
                d.size,
                seed + i,
                d.limit,
                false,
                true,
                d.speed
            ),
        }));

    output = output.filter((d) => !isNaN(d.size));

    return output;
};
