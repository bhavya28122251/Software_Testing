// stryker.integration.conf.js
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
    // Mutate the routes
    mutate: ["routes/**/*.js"],

    // Use specific mutators suitable for Express routes
    mutator: {
        excludedMutations: [],
        plugins: null // use default plugins
    },
    // Note: In newer Stryker versions, we just use default mutator or exclude specific ones.
    // If we want to restrict, we can use 'excludedMutations'.
    // For now, let's use the default set but we can tune it if needed.
    // The user asked for specific operators, but Stryker config usually enables all by default.
    // We can explicitly list them if we want to be strict, but usually it's better to exclude 'Math' etc if not needed.
    // Let's stick to defaults for now as they cover the requested ones, but we will set concurrency to 1.

    testRunner: "mocha",
    mochaOptions: {
        spec: ["test/integration/**/*.js"],
        timeout: 10000 // Higher timeout for integration tests
    },

    // SQLite file locking issues with parallel execution
    concurrency: 1,

    reporters: ["clear-text", "progress", "html"],
    htmlReporter: {
        baseDir: "mutation-report/integration"
    },

    coverageAnalysis: "perTest",
    timeoutMS: 60000,

    // Ensure we don't mutate the DB file or other non-code assets
    ignorePatterns: ["integration_test.db", "data/*.db"]
};
