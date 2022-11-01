module.exports = {
    plugins: [
        require("autoprefixer"),
        require("postcss-preset-env")({ stage: 1 }),
        require("postcss-import"),
        require("postcss-assets")({ relative: true }),
        require("cssnano")({ preset: "default" }),
        require("postcss-extend"),
    ],
};
