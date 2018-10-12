const { getLoader, injectBabelPlugin } = require("react-app-rewired")
const tsImportPluginFactory = require("ts-import-plugin")

module.exports = function override(config, env) {
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
            libraryDirectory: "es",
            libraryName: "antd",
            style: "css",
          },
        ]),
      ],
    }),
  }

  delete config.resolve.plugins.ModuleScopePlugin

  return config
}
