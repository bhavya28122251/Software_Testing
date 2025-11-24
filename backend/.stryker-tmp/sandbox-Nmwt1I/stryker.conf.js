// @ts-nocheck
module.exports = {
  mutate: [
    "services/**/*.js"],

  testRunner: "jest",
  jest: {
    projectType: "custom",
    config: {}   // FIX: no external jest.config.js needed
  },

  reporters: ["progress", "clear-text", "html"],

  mutator: {
    excludedMutations: [
      // Disable all except the chosen 6:
      "ArithmeticOperator",
      "ArrayLiteral",
      "ArrayMethod",
      "BooleanLiteral",
      "ObjectLiteral",
      "Regex",
      "UnaryOperator",
      "UpdateOperator",
      "RemoveConditionals"
    ]
  },

  thresholds: {
    high: 80,
    low: 60,
    break: 0
  }
};
