const config = {
  rootDir: "../src/server",
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.test.json"
    }
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  // testRegex: "(/__tests__/.*|(\\.|/)(test))\\.(js?|ts?)$",
  //testRegex: "main.test.ts",
  testMatch: [
    '**/main.test.ts'
  ],
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