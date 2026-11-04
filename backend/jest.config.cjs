module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", {
      tsconfig: {
        allowJs: true,
        module: "commonjs",
        target: "ES2022",
        esModuleInterop: true
      }
    }]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(sanitize-html|htmlparser2|domhandler|domutils|entities|domelementtype|dom-serializer|css-select|boolbase|nth-check|css-what|uhyphen)/)"
  ]
};
