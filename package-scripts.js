"use strict";

const utils = require("nps-utils");
const root = require("app-root-path");
require("./env.js");

/**
 * @type {import("type-fest").PackageJson}
 */
const pkg = root.require("package.json");
const dir = { bin: "bin", src: "src", ...pkg.directories };
const env = process.env.NODE_ENV || "development";

// const copy = (src) => utils.copy(`"${src}" "../${dir.lib}" --cwd "${dir.src}" --parents`);

module.exports = {
  options: {
    logLevel: "warn",
  },
  scripts: {
    clean: utils.rimraf(dir.lib),
    build: utils.series(
      "tsc --project tsconfig.types.json",
      `babel --quiet --env-name=${env} --extensions=".js,.ts" --ignore "**/*.test.ts" --source-maps --out-dir="${dir.lib}" "${dir.src}"`,
    ),
    lint: `eslint "${dir.bin}/**" "${dir.src}/**" *.js *.md`,
    test: utils.crossEnv("NODE_ENV=test jest --coverage"),

    npm: {
      prepack: utils.series.nps("clean", "build"),
      postpack: utils.series.nps("clean"),
      start: "nodemon bin",
      test: utils.series.nps("lint", "test"),
    },
  },
};
