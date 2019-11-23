const yargs = require("yargs");
const { configStore } = require("../../stores/configStore");

const createCommandLineService = () => {
  let params = null;

  return {
    init: () => {
      params = yargs
        .option("config", {
          describe: "Absolute path to config file.",
          demandOption: true,
          type: "string"
        })
        .option("device-index", {
          describe: "Index of device to run.",
          demandOption: true,
          type: "number"
        })
        .argv;

      configStore.setState({
        configPath: params.config,
        deviceIndex: params.deviceIndex,
        config: require(params.config)
      });
    },
    getConfigPath: () => {
      return params.config;
    },
    getDeviceIndex: () => {
      return params.deviceIndex;
    }
  };
};

module.exports = {
  createCommandLineService,
  commandLineService: createCommandLineService()
};