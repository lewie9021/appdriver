const { appiumService } = require("./services/appiumService");
const { isInstanceOf } = require("../utils");
const { ActionError, AppiumError } = require("./errors");

const handleActionError = (message) => (err) => {
  if (isInstanceOf(err, AppiumError)) {
    throw new ActionError(message);
  }

  throw err;
};

class Alert {
  getText() {
    return appiumService.getAlertText()
      .catch(handleActionError("Failed to get alert text."));
  }

  accept() {
    return appiumService.acceptAlert()
      .catch(handleActionError("Failed to accept alert."));
  }

  dismiss() {
    return appiumService.dismissAlert()
      .catch(handleActionError("Failed to dismiss alert."));
  }

  setValue(value) {
    return appiumService.setAlertValue({ value })
      .catch(handleActionError("Failed to set alert value."));
  }

  isVisible() {
    return appiumService.getAlertVisible()
      .catch((handleActionError("Failed to get visibility status of alert.")));
  }
}

module.exports = {
  Alert
};