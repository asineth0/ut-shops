const { buildSync } = require("esbuild");
const pkg = require("../package.json");

buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  external: Object.keys(pkg.devDependencies),
  outdir: "dist",
});
