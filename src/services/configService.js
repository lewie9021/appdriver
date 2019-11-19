function createConfigService() {
  return {
    getBaseUrl: () => {
      return "http://localhost:4723/wd/hub";
    }
  };
}

module.exports = {
  createConfigService,
  configService: createConfigService()
};