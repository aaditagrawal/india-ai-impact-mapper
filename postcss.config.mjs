import babelConfig from "./babel.config.js";
const config = {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["app/**/*.stylex.js"],
      babelConfig: { babelrc: false, configFile: false, plugins: babelConfig.plugins },
      useCSSLayers: false,
    },
  },
};

export default config;
