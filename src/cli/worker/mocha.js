const Mocha = require("mocha");

function runTestSpecs(capability, specFiles, opts) {
  return new Promise((resolve) => {
    // Instantiate a Mocha instance.
    const mocha = new Mocha({
      ...opts,
      reporter: function(runner, options) {
        runner.on("start", () => {
          process.send({
            type: "FRAMEWORK_START",
            payload: {
              total: runner.total
            }
          });
        });

        runner.on("test", (test) => {
          process.send({
            type: "TEST_START",
            payload: {
              name: test.fullTitle(),
            }
          });
        });

        runner.on("pass", (test) => {
          process.send({
            type: "TEST_PASSED",
            payload: {
              name: test.fullTitle(),
              duration: test.duration
            }
          });
        });

        runner.on("fail", (test, err) => {
          process.send({
            type: "TEST_FAILED",
            payload: {
              name: test.fullTitle(),
              duration: test.duration,
              message: err.message,
              stack: err.stack
            }
          });
        });
      }
    });

    specFiles.forEach((specPath) => {
      mocha.addFile(specPath);
    });

    mocha.run(resolve);
  });
}

module.exports = {
  runTestSpecs
};