/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutate: [
    "routes/**/*.js"
  ],

  mutator: "javascript",

  testRunner: "mocha",

  mochaOptions: {
    spec: ["test/integration/**/*.test.js"],
    require: ["test/setup.js"],
    timeout: 20000
  },

  reporters: ["clear-text", "progress", "html"],

  htmlReporter: {
    baseDir: "mutation-report/integration"
  },

  coverageAnalysis: "off",

  concurrency: 2,
  timeoutMS: 120000,

  thresholds: { high: 80, low: 60, break: 50 }
};
