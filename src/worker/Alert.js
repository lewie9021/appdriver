const { configStore } = require("../stores/configStore");
const { appiumService } = require("./services/appiumService");
const { Expect } = require("./Expect");
const { isInstanceOf, pollFor } = require("../utils");
const { ActionError, AppiumError, WaitError } = require("./errors");

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

    return appiumService.getAlertText()
      .catch(handleActionError("Failed to accept alert. No alert present."))
      .then((text) => {
        return appiumService.acceptAlert()
          .then(() => {
            return pollFor(async () => {
              const visible = await appiumService.getAlertVisible({ text });
              return new Expect(visible).toBeFalsy();
            }, { maxDuration, interval })
              .catch(() => { throw new ActionError(timeoutMessage); });
          })
          .catch(handleActionError("Failed to accept alert. Alert still present."));
      });
  }

  dismiss() {
    const maxDuration = 5000;
    const interval = 200;
    const timeoutMessage = `Failed to dismiss alert. Alert still visible after ${maxDuration}ms.`;

    return appiumService.getAlertText()
      .catch(handleActionError("Failed to dismiss alert. No alert present."))
      .then((text) => {
        return appiumService.dismissAlert()
          .then(() => {
            return pollFor(async () => {
              const visible = await appiumService.getAlertVisible({ text });
              return new Expect(visible).toBeFalsy();
            }, { maxDuration, interval })
              .catch(() => { throw new ActionError(timeoutMessage); });
          })
          .catch(handleActionError("Failed to dismiss alert. Alert still present."));
      });
  }

  setValue(value) {
    return appiumService.setAlertValue({ value })
      .catch(handleActionError("Failed to set alert value."));
  }

  isVisible() {
    return appiumService.getAlertVisible()
      .catch(handleActionError("Failed to get visibility status of alert."));
  }

  waitToBeVisible(options = {}) {
    const maxDuration = options.maxDuration || configStore.getWaitForTimeout();
    const interval = options.interval || configStore.getWaitForInterval();
    const conditionFn = () => new Expect(appiumService.getAlertVisible()).toBeTruthy();
    const timeoutMessage = `Alert not visible after ${maxDuration}ms timeout (interval: ${interval}ms).`;

    return pollFor(conditionFn, { maxDuration, interval })
      .catch((errors) => { throw new WaitError(timeoutMessage, errors); });
  }
}

module.exports = {
  Alert
};