// stryker.conf.js
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  // Mutate only the service files for unit testing
  mutate: ["services/**/*.js"],

  // Use the JavaScript mutator with ONLY the operators we want
  mutator: {
    name: "javascript",
    excludedMutations: [
      // Disable all operators EXCEPT the 6 we need

      // We KEEP:
      // BooleanSubstitution
      // LogicalOperator
      // EqualityOperator
      // ConditionalBoundary
      // StringLiteral
      // BlockStatement

      // We DISABLE everything else:
      "ArithmeticOperator",
      "ArrayDeclarator",
      "ArrowFunction",
      "AssignmentExpression",
      "BinaryExpression",
      "BlockStatementDeletion",
      "ConditionalExpression",
      "ObjectLiteral",
      "PostfixUnaryOperator",
      "PrefixUnaryOperator",
      "RegexLiteral",
      "SwitchCase",
      "UpdateOperator",
      "MethodExpression",
      "CallExpression",
      "ReturnStatement",
      "ThrowStatement"
    ]
  },

  // Reporters for output
  reporters: ["clear-text", "progress", "html"],
  htmlReporter: {
    baseDir: "mutation-report/unit"
  },

  // Map which test killed which mutant
  coverageAnalysis: "perTest",

  concurrency: 4,
  timeoutMS: 60000
};
