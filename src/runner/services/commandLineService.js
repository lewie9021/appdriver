const path = require("path");
const yargs = require("yargs");
const { configStore } = require("../../stores/configStore");

const createCommandLineService = () => {
  let params = null;

  return {
    init: () => {
      params = yargs
        .option("config", {
          describe: "Path to config file.",
          demandOption: true,
          type: "string",
          coerce: (arg) => path.resolve(process.cwd(), arg)
        })
        .argv;

      configStore.setState({
        configPath: params.config,
        config: require(params.config)
      });
    },
    getConfigPath: () => {
      return params.config;
    }
  };
};

module.exports = {
  createCommandLineService,
  commandLineService: createCommandLineService()
};