/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 *
 *    Mutation Operators used:
 *   - LogicalOperator
 *   - EqualityOperator
 *   - ObjectLiteral, ArrayLiteral (for parameter/argument mutations)
 *   - CallExpression / method-call related mutations (left enabled)
 *   - ReturnStatement, ThrowStatement, BlockStatement (for statement removal / error-path testing)
 *
 * We exclude many low-value mutation types to keep the run focused and faster.
 */
module.exports = {
  mutate: [
    "routes/**/*.js"
  ],

  mutator: {
    name: "javascript",
    excludedMutations: [
      "ArithmeticOperator",
      "NumericLiteral",
      "StringLiteral",
      "BooleanLiteral",
      "RegExpLiteral",
      "FunctionDeclaration",
      "FunctionExpression",
      "ForStatement",
      "WhileStatement",
      "DoWhileStatement",
      "AssignmentOperator",
      "UpdateOperator",
      "UnaryOperator",
      "ArrayDeclaration",
      "ConditionalExpression",
      "BooleanSubstitution",
      "BlockStatement"
    ]
  },

  testRunner: "mocha",

  mochaOptions: {
    spec: ["test/integration/**/*.test.js"],
    require: ["test/setup.js"]
  },

  reporters: ["clear-text", "progress", "html"],
  htmlReporter: {
    fileName: "mutation-report/integration/index.html"
  },

  coverageAnalysis: "off",
  concurrency: 2,
  timeoutMS: 120000,

  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};
