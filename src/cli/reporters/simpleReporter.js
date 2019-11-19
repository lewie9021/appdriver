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

function simpleReporter(events) {
  const getCapabilityText = (capability) => `${weights.bold}${getCapabilityName(capability)}${weights.end}`;
  const getDurationText = (duration) =>  `${colors.cyan}(${duration}ms)${colors.end}`;

  events.on("worker:started", ({ capability }) => {
    console.log(`${getCapabilityText(capability)}: Started`);
  });

  events.on("worker:finished", ({ capability }) => {
    console.log(`${getCapabilityText(capability)}: Finished`);
  });

  events.on("test:passed", ({ capability, name, duration }) => {
    const nameText = `${colors.green}${name}${colors.end}`;

    console.log(`${getCapabilityText(capability)}: ${nameText} ${getDurationText(duration)}`);
  });

  events.on("test:failed", ({ capability, name, duration, message, stack }) => {
    const nameText = `${colors.red}${name}${colors.end}`;

    console.log(`${getCapabilityText(capability)}: ${nameText} ${getDurationText(duration)}`);
  });
}

module.exports = simpleReporter;