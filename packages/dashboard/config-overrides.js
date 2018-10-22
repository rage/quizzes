const { getLoader, injectBabelPlugin } = require("react-app-rewired")
const tsImportPluginFactory = require("ts-import-plugin")
const path = require("path")

module.exports = function rewire(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === "string" &&
      rule.loader.includes("ts-loader"),
  )

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory([
          {
            libraryDirectory: "../common",
            libraryName: "@quizzes/common",
          },
        ]),
      ],
    }),
  }

  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    "@quizzes/common": path.resolve("../common/src"),
  })

  config.resolve.plugins = []

  return config
}
