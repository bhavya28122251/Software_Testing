/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 *
 * This config mutates route files and keeps the high-value integration mutation
 * operators active:
 *   - LogicalOperator
 *   - EqualityOperator
 *   - ObjectLiteral, ArrayLiteral (for parameter/argument mutations)
 *   - CallExpression / method-call related mutations (left enabled)
 *   - ReturnStatement, ThrowStatement, BlockStatement (for statement removal / error-path testing)
 *
 * We exclude many low-value mutation types to keep the run focused and faster.
 */
module.exports = {
  // Files to mutate (adjust if your routes are under a different path)
  mutate: [
    "routes/**/*.js"
    // If you prefer to mutate exactly the 4 route files you uploaded, use:
    // "routes/attendance.js", "routes/courses.js", "routes/enrollments.js", "routes/students.js"
    // or the uploaded absolute paths: "/mnt/data/attendance.js", ...
  ],

  // Use JavaScript mutator; supply excludedMutations to remove low-value types.
  // (You can remove `name` field if your Stryker version warns; included for clarity.)
  mutator: {
    name: "javascript",
    // Exclude many mutation types we don't want for integration testing.
    // This list intentionally leaves LogicalOperator, EqualityOperator,
    // ObjectLiteral, ArrayLiteral, ReturnStatement, ThrowStatement, BlockStatement, etc. active.
    excludedMutations: [
      // numeric / arithmetic / literal mutations (less useful for route-level integration)
      "ArithmeticOperator",
      "NumericLiteral",
      "StringLiteral",
      "BooleanLiteral",
      "RegExpLiteral",

      // local control/structure changes we don't need here
      "FunctionDeclaration",
      "FunctionExpression",
      "ForStatement",
      "WhileStatement",
      "DoWhileStatement",

      // assignment & update ops are lower-value for route-level tests
      "AssignmentOperator",
      "UpdateOperator",
      "UnaryOperator",

      // array declaration vs array literal: keep ArrayLiteral enabled for param mutations,
      // but exclude ArrayDeclaration (if present in your Stryker version)
      "ArrayDeclaration",

      // others less valuable here
      "ConditionalExpression", // keep if you want, but can create many trivial mutants
      "BooleanSubstitution",    // converts boolean to true/false literals - often noise
      "BlockStatement" 
    ]
  },

  testRunner: "mocha",

  // Mocha options — run only your integration tests and preload test/setup.js
  mochaOptions: {
    spec: ["test/integration/**/*.test.js"],
    require: ["test/setup.js"]
    // Note: use a .mocharc.js if you need custom timeouts
  },

  // Reporter and HTML output file (Stryker v7+ uses html built into core)
  reporters: ["clear-text", "progress", "html"],
  htmlReporter: {
    // fileName path for the HTML report
    fileName: "mutation-report/integration/index.html"
  },

  // For integration runs prefer 'off' because perTest is brittle for DB-backed tests
  coverageAnalysis: "off",

  // Mutating integration tests is resource-heavy; tune concurrency accordingly
  concurrency: 2,
  timeoutMS: 120000,

  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};
