const { getCapabilityName } = require("../utils");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  end: "\x1b[0m"
};

const weights = {
  bold: "\033[1m",
  end: "\033[0m"
};

function simpleReporter(workers) {
  workers.forEach(({ capability, worker }) => {
    const tag = `${weights.bold}${getCapabilityName(capability)}${weights.end}`;

    worker.on("message", ({ type, payload }) => {
      const duration = `${colors.cyan}(${payload.duration}ms)${colors.end}`;

      switch (type) {
        case "MOCHA_TEST_PASS":
          console.log(`${tag}: ${colors.green}${payload.name}${colors.end} ${duration}`);
          break;
        case "MOCHA_TEST_FAIL":
          console.log(`${tag}: ${colors.red}${payload.name}${colors.end} ${duration}`);
          break;
      }
    });

    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stdout);
  });

}

module.exports = simpleReporter;