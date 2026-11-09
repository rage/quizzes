/** @type {import("next").NextConfig} */
module.exports = {
  compiler: { styledComponents: { ssr: true, displayName: true } },
  images: { unoptimized: true },
  agentRules: false,
  output: "standalone",
  // Next bundles @mui/material for the server; left external, these would load a second
  // @emotion/react and MUI instance that doesn't see the app's Emotion cache and theme.
  transpilePackages: ["@mui/material-nextjs", "@mui/x-date-pickers"],
}
