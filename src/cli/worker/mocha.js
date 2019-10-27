const Mocha = require("mocha");

function runTestSpecs(capability, specFiles, opts) {
  return new Promise((resolve) => {
    // Instantiate a Mocha instance.
    const mocha = new Mocha({
      ...opts,
      reporter: function(runner, options) {
        runner.on("start", () => {
          process.send({
            type: "MOCHA_START",
            payload: {
              total: runner.total
            }
          });
        });

        runner.on("test", (test) => {
          process.send({
            type: "MOCHA_TEST",
            payload: {
              name: test.fullTitle(),
              duration: test.duration
            }
          });
        });

        runner.on("pass", (test) => {
          process.send({
            type: "MOCHA_TEST_PASS",
            payload: {
              name: test.fullTitle(),
              duration: test.duration
            }
          });
        });

        runner.on("fail", (test, err) => {
          process.send({
            type: "MOCHA_TEST_FAIL",
            payload: {
              name: test.fullTitle(),
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