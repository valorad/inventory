const config = {
  rootDir: "..",
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "./src/jest.setup.ts",
  globals: {
    "ts-jest": {
      tsConfigFile: "./tsconfig.test.json"
    },
    __TRANSFORM_HTML__: true
  }
}

module.exports = config;