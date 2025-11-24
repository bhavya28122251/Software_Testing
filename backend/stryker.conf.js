// stryker.conf.js
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  // Mutate only the service files (unit-level)
  mutate: ["services/**/*.js"],

  // JS mutator (default)
  mutator: "javascript",

  // Use mocha as test runner and point to unit tests
  testRunner: "mocha",
  mochaOptions: {
    spec: ["test/unit/**/*.js"]
  },

  // Reporters (console + html)
  reporters: ["clear-text", "progress", "html"],
  htmlReporter: {
    baseDir: "mutation-report/unit"
  },

  // perTest gives mapping of which test killed which mutant (slower)
  coverageAnalysis: "perTest",

  // tuning
  concurrency: 4,
  timeoutMS: 60000
};
