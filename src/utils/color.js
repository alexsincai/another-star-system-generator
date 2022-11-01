//  Shamelessly pilfered from:
//     https://drafts.csswg.org/css-color-4/multiply-matrices.js
//     https://drafts.csswg.org/css-color-4/conversions.js
//     https://css.land/lch/lch.js

export const multiplyMatrices = (A, B) => {
    let m = A.length;

    if (!Array.isArray(A[0])) {
        A = [A];
    }

    if (!Array.isArray(B[0])) {
        B = B.map((x) => [x]);
    }

    let p = B[0].length;
    let B_cols = B[0].map((_, i) => B.map((x) => x[i]));
    let product = A.map((row) =>
        B_cols.map((col) =>
            !Array.isArray(row)
                ? col.reduce((a, c) => a + c * row, 0)
                : row.reduce((a, c, i) => a + c * (col[i] || 0), 0)
        )
    );

    if (m === 1) {
        product = product[0];
    }

    if (p === 1) {
        return product.map((x) => x[0]);
    }

    return product;
};

const D50 = [0.3457 / 0.3585, 1.0, (1.0 - 0.3457 - 0.3585) / 0.3585];

const gam_sRGB = (RGB) =>
    RGB.map((val) => {
        const abs = Math.abs(val);

        if (abs > 0.0031308) {
            return Math.sign(val) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
        }

        return 12.92 * val;
    });

const XYZ_to_lin_sRGB = (XYZ) =>
    multiplyMatrices(
        [
            [12831 / 3959, -329 / 214, -1974 / 3959],
            [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
            [705 / 12673, -2585 / 12673, 705 / 667],
        ],
        XYZ
    );

const D50_to_D65 = (XYZ) =>
    multiplyMatrices(
        [
            [0.9554734527042182, -0.023098536874261423, 0.0632593086610217],
            [-0.028369706963208136, 1.0099954580058226, 0.021041398966943008],
            [0.012314001688319899, -0.020507696433477912, 1.3303659366080753],
        ],
        XYZ
    );

const Lab_to_XYZ = (Lab) => {
    const factor = 24389 / 27;
    const limit = 216 / 24389;
    let f = [];

    f[1] = (Lab[0] + 16) / 116;
    f[0] = Lab[1] / 500 + f[1];
    f[2] = f[1] - Lab[2] / 200;

    return [
        Math.pow(f[0], 3) > limit
            ? Math.pow(f[0], 3)
            : (116 * f[0] - 16) / factor,
        Lab[0] > factor * limit
            ? Math.pow((Lab[0] + 16) / 116, 3)
            : Lab[0] / factor,
        Math.pow(f[2], 3) > limit
            ? Math.pow(f[2], 3)
            : (116 * f[2] - 16) / factor,
    ].map((value, i) => value * D50[i]);
};

const LCH_to_Lab = (LCH) => [
    LCH[0],
    LCH[1] * Math.cos((LCH[2] * Math.PI) / 180),
    LCH[1] * Math.sin((LCH[2] * Math.PI) / 180),
];

const LCH_to_sRGB = (LCH) =>
    gam_sRGB(XYZ_to_lin_sRGB(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));

const check = (l, c, h) => {
    let rgb = LCH_to_sRGB([+l, +c, +h]);
    const step = 0.000005;
    return rgb.reduce((a, b) => a && b >= 0 - step && b <= 1 + step, true);
};

const gamut = (l, c, h) => {
    if (check(l, c, h)) {
        return [l, c, h];
    }

    let hiC = c;
    let loC = 0;
    const step = 0.0001;
    c /= 2;

    while (hiC - loC > step) {
        if (check(l, c, h)) {
            loC = c;
        } else {
            hiC = c;
        }
        c = (hiC + loC) / 2;
    }

    return [l, c, h];
};

export const color = (l, c, h) => {
    [l, c, h] = gamut(l, c, h);
    return (
        "#" +
        LCH_to_sRGB([+l, +c, +h])
            .map((x) => Math.round(x * 100))
            .map((x) => Number(x).toString(16))
            .map((x) => `0${x}`.slice(-2))
            .join("")
    );
};
