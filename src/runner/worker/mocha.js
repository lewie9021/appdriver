const Mocha = require("mocha");

function runTestSpecs(config) {
  return new Promise((resolve) => {
    // Instantiate a Mocha instance.
    const mocha = new Mocha({
      timeout: 30 * 1000
    });

    config.specs.forEach((specPath) => {
      mocha.addFile(specPath);
    });

    // Run the tests.
    mocha.run(resolve);
  });
}

module.exports = {
  runTestSpecs
};