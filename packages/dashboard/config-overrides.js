const { getLoader, injectBabelPlugin } = require("react-app-rewired")
const tsImportPluginFactory = require("ts-import-plugin")
const path = require("path")

module.exports = function rewire(config, env) {
  /*   const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === "string" &&
      rule.loader.includes("ts-loader"),
  ) */

  const tsLoader = getLoader(
    config.module.rules,
    (rule) => rule.test && String(rule.test) === String(/\.(ts|tsx)$/),
  )

  delete tsLoader.include

  /*tsLoader.use.options = {
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
  }*/

  const oneOf = config.module.rules.find((rule) => rule.oneOf).oneOf
  oneOf.unshift(tsLoader)

  /*config.resolve.alias = Object.assign({}, config.resolve.alias, {
    "@quizzes/common": path.resolve("../common/src"),
  })*/

  config.resolve.plugins = []

  return config
}
