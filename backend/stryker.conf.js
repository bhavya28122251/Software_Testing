// stryker.conf.js
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutate: ["services/**/*.js"],

  
  mutator: {
    name: "javascript",
    excludedMutations: [
      // Disabled all operators EXCEPT these 6:

      // BooleanSubstitution
      // LogicalOperator
      // EqualityOperator
      // ConditionalBoundary
      // StringLiteral
      // BlockStatement

     
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


  reporters: ["clear-text", "progress", "html"],
  htmlReporter: {
    baseDir: "mutation-report/unit"
  },

  
  coverageAnalysis: "perTest",

  concurrency: 4,
  timeoutMS: 60000
};
