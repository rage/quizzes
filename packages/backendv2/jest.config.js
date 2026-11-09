module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  setupFilesAfterEnv: ["jest-extended/all"],
  verbose: false,
}
