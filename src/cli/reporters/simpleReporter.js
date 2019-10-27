const { getCapabilityName } = require("../utils");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  end: "\x1b[0m"
};

const weights = {
  bold: "\033[1m",
  end: "\033[0m"
};

function simpleReporter(workers) {
  workers.forEach(({ capability, worker }, index) => {
    const tag = `${weights.bold}${getCapabilityName(capability)}${weights.end}`;

    worker.on("message", ({ type, payload }) => {
      switch (type) {
        case "MOCHA_TEST_PASS":
          console.log(`${tag}: ${colors.green}${payload.name}${colors.end}`);
          break;
        case "MOCHA_TEST_FAIL":
          console.log(`${tag}: ${colors.red}${payload.name}${colors.end}`);
          break;
      }
    });

    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stdout);
  });

}

module.exports = simpleReporter;