const Mocha = require("mocha");

function runTestSpec(specPath, opts) {
  return new Promise((resolve) => {
    // Instantiate a Mocha instance.
    const mocha = new Mocha({
      ...opts,
      reporter: (runner) => {
        runner.on("start", () => {
          process.send({
            type: "SPEC_STARTED",
            payload: {
              total: runner.total
            }
          });
        });

        runner.on("test", (test) => {
          process.send({
            type: "TEST_STARTED",
            payload: {
              name: test.fullTitle()
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
          console.error(err);
        });
      }
    });

    mocha
      .addFile(specPath)
      .run((failures) => {
        process.send({
          type: "SPEC_FINISHED",
          payload: {
            failures
          }
        });

        resolve(failures);
      });
  });
}

module.exports = {
  runTestSpec
};
