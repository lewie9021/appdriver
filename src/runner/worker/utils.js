const path = require("path");
const argv = require("yargs").argv;

function transformConfig(config, configPath) {
  return {
    ...config,
    specs: config.specs.map((relativeSpecPath) => {
      return path.join(path.dirname(configPath), relativeSpecPath);
    })
  };
}

function getConfig() {
  const relativeConfigPath = argv.configPath;
  const configPath = path.join(process.cwd(), relativeConfigPath);

  return transformConfig(require(configPath), configPath);
}

const getCapabilityName = (capability) => {
  return `${capability.deviceName} (${capability.platformName} ${capability.platformVersion})`;
};

module.exports = {
  getConfig,
  getCapabilityName
};