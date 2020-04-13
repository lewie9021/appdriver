const { appiumService } = require("./services/appiumService");
const { Expect } = require("./Expect");
const { isInstanceOf, pollFor } = require("../utils");
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
    const maxDuration = 5000;
    const interval = 200;
    const timeoutMessage = `Failed to accept alert. Alert still visible after ${maxDuration}ms.`;
    const getAlertText = () => appiumService.getAlertText().catch(() => "");

    return getAlertText()
      .then((text) => {
        return appiumService.acceptAlert()
          .then(() => {
            return pollFor(() => new Expect(getAlertText()).not.toEqual(text), { maxDuration, interval })
              .catch(() => { throw new ActionError(timeoutMessage); });
          })
          .catch(handleActionError("Failed to accept alert."));
      });
  }

  dismiss() {
    const maxDuration = 5000;
    const interval = 200;
    const timeoutMessage = `Failed to dismiss alert. Alert still visible after ${maxDuration}ms.`;
    const getAlertText = () => appiumService.getAlertText().catch(() => "");

    return getAlertText()
      .then((text) => {
        return appiumService.dismissAlert()
          .then(() => {
            return pollFor(() => new Expect(getAlertText()).not.toEqual(text), { maxDuration, interval })
              .catch(() => { throw new ActionError(timeoutMessage); });
          })
          .catch(handleActionError("Failed to dismiss alert."));
      });
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