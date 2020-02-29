const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
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

function basicReporter(events) {
  const getCapabilityText = (capability) => `${weights.bold}${getCapabilityName(capability)}${weights.end}`;
  const getDurationText = (duration) =>  `${colors.cyan}(${duration}ms)${colors.end}`;
  let totals = {
    devices: {
      total: 0
    },
    specs: {
      total: 0,
      passed: 0
    },
    tests: {
      total: 0,
      passed: 0
    }
  };

  events.on("device:started", ({ device }) => {
    totals.devices.total += 1;
    console.log(`${getCapabilityText(device.capabilities)}: Started`);
  });

  events.on("device:finished", ({ device }) => {
    console.log(`${getCapabilityText(device.capabilities)}: Finished`);
  });

  events.on("spec:started", () => {
    totals.specs.total += 1;
  });

  events.on("spec:finished", ({ failures }) => {
    if (failures === 0) {
      totals.specs.passed += 1;
    }
  });

  events.on("test:started", () => {
    totals.tests.total += 1;
  });

  events.on("test:passed", ({ device, specPath, name, duration }) => {
    const nameText = `${colors.green}${name}${colors.end}`;
    const specPathText = `${colors.blue}${specPath}${colors.end}`;

    totals.tests.passed += 1;
    console.log(`${getCapabilityText(device.capabilities)}: ${specPathText} ${nameText} ${getDurationText(duration)}`);
  });

  events.on("test:failed", ({ device, specPath, name, duration }) => {
    const nameText = `${colors.red}${name}${colors.end}`;
    const specPathText = `${colors.blue}${specPath}${colors.end}`;

    console.log(`${getCapabilityText(device.capabilities)}:  ${specPathText} ${nameText} ${getDurationText(duration)}`);
  });

  events.on("worker:retry", ({ device, specPath, retries, maxRetries }) => {
    const specPathText = `${colors.blue}${specPath}${colors.end}`;
    const countText = `${colors.cyan}(${retries}/${maxRetries})${colors.end}`;

    console.log(`${getCapabilityText(device.capabilities)}: ${specPathText} ${colors.red}Retrying...${colors.end} ${countText}`);
  });

  events.on("runner:finished", () => {
    const totalDevices = totals.devices.total;
    const deviceText = `${weights.bold}Devices:${weights.end}`;
    const deviceTotalsText = `${totalDevices} total`;

    const totalSpecs = totals.specs.total;
    const specFailures = totals.specs.total - totals.specs.passed;
    const specsText = `${weights.bold}Specs:${weights.end}`;
    const specTotalsText = specFailures > 0
      ? `${colors.red}${specFailures} failed${colors.end}, ${totalSpecs} total`
      : `${totalSpecs} total`;

    const totalTests = totals.tests.total;
    const testFailures = totals.tests.total - totals.tests.passed;
    const testsText = `${weights.bold}Tests:${weights.end}`;
    const testTotalsText = testFailures > 0
      ? `${colors.red}${testFailures} failed${colors.end}, ${totalTests} total`
      : `${totalTests} total`;

    console.log();
    console.log(`${deviceText} ${deviceTotalsText}`);
    console.log(`${specsText} ${specTotalsText}`);
    console.log(`${testsText} ${testTotalsText}`);
  });
}

module.exports = basicReporter;
