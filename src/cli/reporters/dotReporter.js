const { getCapabilityName } = require("../utils");

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  end: "\x1b[0m"
};

function dotReporter(workers) {
  let data = workers.map(({ capability }) => ({
    name: getCapabilityName(capability),
    statuses: null
  }));
  let logs = [];
  let prevLogCount = 0;

  function draw(redraw) {
    if (redraw) {
      const linesToMoveUp = (data.length + prevLogCount);
      process.stdout.moveCursor(0, linesToMoveUp * -1);
    }

    process.stdout.cursorTo(0);

    for (let i = 0; i < logs.length; i += 1) {
      process.stdout.clearLine();
      process.stdout.write(logs[i]);
      process.stdout.write("\n");
    }

    for (let i = 0; i < data.length; i += 1) {
      const { name, statuses } = data[i];

      process.stdout.clearLine();
      process.stdout.write(`${name}:`);
      process.stdout.write(" ");

      if (statuses) {
        for (let ii = 0; ii < statuses.length; ii += 1) {
          const status = statuses[ii];

          switch (status) {
            case "PENDING": process.stdout.write("○"); break;
            case "STARTED": process.stdout.write("●"); break;
            case "PASSED": process.stdout.write(`${colors.green}●${colors.end}`); break;
            case "FAILED": process.stdout.write(`${colors.red}●${colors.end}`); break;
          }
        }
      } else {
        process.stdout.write(`Launching...`);
      }

      process.stdout.write("\n");
    }

    prevLogCount = logs.length;
  }

  workers.forEach(({ capability, worker }, index) => {
    let testIndex = -1;
    worker.on("message", ({ type, payload }) => {
      switch (type) {
        case "MOCHA_START":
          data[index].statuses = [...Array(payload.total)].map(() => "PENDING");
          break;
        case "MOCHA_TEST":
          testIndex += 1;
          data[index].statuses[testIndex] = "STARTED";
          break;
        case "MOCHA_TEST_PASS":
          data[index].statuses[testIndex] = "PASSED";
          break;
        case "MOCHA_TEST_FAIL":
          data[index].statuses[testIndex] = "FAILED";
          break;
      }

      draw(true);
    });

    worker.stdout.on("data", (x) => {
      const str = x.toString();

      logs.push(...str.trim().split("\n"));
      draw(true);
    });

    worker.stderr.on("data", (x) => {
      const str = x.toString();

      logs.push(...str.trim().split("\n"));
      draw(true);
    });
  });

  draw();
}

module.exports = dotReporter;