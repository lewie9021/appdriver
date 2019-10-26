const Mocha = require("mocha");

function runTestSpecs(specFiles, opts) {
  return new Promise((resolve) => {
    // Instantiate a Mocha instance.
    const mocha = new Mocha(opts);

    specFiles.forEach((specPath) => {
      mocha.addFile(specPath);
    });

    mocha.run(resolve);
  });
}

// mocha.reporter(function(x, y) {
//   // console.log(x);
//   console.log(y);
// });

// runner.on("start", (x) => {
//   console.log("START:", x);
// });
//
// runner.on("ready", (x) => {
//   console.log("READY:", x);
// });
//
// runner.on("suite", (suite) => {
//   console.log("SUITE", suite.fullTitle());
// });
//
// runner.on("test", (test) => {
//   console.log("TEST", test.fullTitle());
// });
//
// runner.on("pass", (test) => {
//   console.log("PASSED", test.fullTitle());
// });
//
// runner.on("fail", (test) => {
//   console.log("FAILED", test.fullTitle());
// });
//
// runner.on("end", (x) => {
//   console.log("END", x);
// });


module.exports = {
  runTestSpecs
};