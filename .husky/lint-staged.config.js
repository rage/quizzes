// Autofixers only; the failing gates (oxlint, oxfmt --check) run in CI.
const isInWorkspace = (file) => !file.includes("/packages/moocfi-quizzes/")

const runOnWorkspaceFiles = (command) => (files) => {
  const workspaceFiles = files.filter(isInWorkspace)
  if (workspaceFiles.length === 0) {
    return []
  }
  return `${command} ${workspaceFiles.map((file) => JSON.stringify(file)).join(" ")}`
}

const config = {
  "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": [
    runOnWorkspaceFiles("oxlint --fix --no-error-on-unmatched-pattern"),
    runOnWorkspaceFiles("oxfmt --no-error-on-unmatched-pattern"),
  ],
  // oxfmt skips types it can't format; negated so JS/TS isn't formatted concurrently with the rule above.
  "!(*.{js,jsx,mjs,cjs,ts,tsx,mts,cts})": runOnWorkspaceFiles(
    "oxfmt --no-error-on-unmatched-pattern",
  ),
}

export default config
