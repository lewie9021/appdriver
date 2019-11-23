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

const getCapabilityName = (capabilities) => {
  return `${capabilities.deviceName} (${capabilities.platformName} ${capabilities.platformVersion})`;
};

function simpleReporter(events) {
  const getCapabilityText = (capability) => `${weights.bold}${getCapabilityName(capability)}${weights.end}`;
  const getDurationText = (duration) =>  `${colors.cyan}(${duration}ms)${colors.end}`;

  events.on("worker:started", ({ device }) => {
    console.log(`${getCapabilityText(device.capabilities)}: Started`);
  });

  events.on("worker:finished", ({ device }) => {
    console.log(`${getCapabilityText(device.capabilities)}: Finished`);
  });

  events.on("test:passed", ({ device, name, duration }) => {
    const nameText = `${colors.green}${name}${colors.end}`;

    console.log(`${getCapabilityText(device.capabilities)}: ${nameText} ${getDurationText(duration)}`);
  });

  events.on("test:failed", ({ device, name, duration }) => {
    const nameText = `${colors.red}${name}${colors.end}`;

    console.log(`${getCapabilityText(device.capabilities)}: ${nameText} ${getDurationText(duration)}`);
  });
}

module.exports = simpleReporter;