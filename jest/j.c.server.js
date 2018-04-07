const config = {
  rootDir: "../src/server",
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.test.json"
    }
  },
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}

module.exports = config;