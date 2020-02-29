# Proposals

This document contains API proposals that may eventually be implemented in the future.

### Device
 
:warning: [```.isReal: Boolean```](./device/isReal.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

TODO: Description here.

:warning: [```.getSource() => Promise<String>```](./device/getSource.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

:warning: [```.execute(command: String, params: Object) => Promise```](./device/execute.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

TODO: Description here.
 
:warning: [```.getGeoLocation() => Promise```](./device/getGeoLocation.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

:warning: [```.setGeoLocation(options: {latitude: Number, longitude: Number, altitude?: Number}) => Promise```](./device/setGeoLocation.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

:warning: [```.getClipboard(options? {contentType?: String}) => Promise<String>```](./device/getClipboard.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

Note: Partial support on Android.
TODO: Description here.

:warning: [```.setClipboard(value: String, options?: {contentType?: String, label?: String}) => Promise```](./device/setClipboard.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

Note: Partial support on Android.
TODO: Description here.

:warning: [```.toggleAirplaneMode() => Promise```](./device/toggleAirplaneMode.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

TODO: Description here.

:warning: [```.toggleWifi() => Promise```](./device/toggleWifi.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

TODO: Description here.

:warning: [```.toggleLocation() => Promise```](./device/toggleLocation.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

TODO: Description here.

:warning: [```.performTouchId(options: {successful: Boolean}) => Promise```](./device/performTouchId.md)

<img src="https://img.shields.io/badge/Platform-iOS-blue.svg" />

Note: Simulator only.
TODO: Description here.

:warning: [```.performFingerPrint(options: {id?: Number}) => Promise```](./device/performFingerPrint.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

Note: Emulator only.
TODO: Description here.

:warning: [```.sendSms({phoneNumber: String, message: String}) => Promise```](./device/sendSms.md)

<img src="https://img.shields.io/badge/Platform-Android-blue.svg" />

Note: Emulator only.
TODO: Description here.

:warning: [```.getSettings() => Promise<Object>```](./device/getSettings.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

:warning: [```.setSettings(settings: Object) => Promise```](./device/setSettings.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

Note: Partial support.
TODO: Description here.

:warning: [```.readFile(filePath: String) => Promise<String>```](./device/readFile.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

:warning: [```.writeFile(filePath: String, data: String) => Promise```](./device/writeFile.md)

<img src="https://img.shields.io/badge/Platform-~Native-blue.svg" />

TODO: Description here.

### Element

:warning: [```.setValue(value: Any) => Element```](./element/setValue.md)

<img src="https://img.shields.io/badge/Platform-All-blue.svg" />

Note: Partial support.
TODO: Description here.

:warning: [```.getAttribute(attribute: String) => Promise<Any>```](./element/getAttribute.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.
Note: Essentially `.typeText` without the string type constraint. Useful when automating sliders.

:warning: [```.swipeIntoView(options: {element: Element, swipeGesture?: Gesture, safeArea?: {top?: Number, right?: Number, bottom?: Number, left?: Number}}) => Element```](./element/swipeIntoView.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

To be used on scrollable elements, ensuring `element` is fully visible so that interactions are successful. Defaults `swipeGesture` to `gestures.swipeUp`.

### Expect

:warning: [```.toHaveAttribute(attribute: String, value: Any) => Promise```](./expect/toHaveAttribute.md)

Asserts the element has `attribute` strictly equal to `value`.

### Alert

:warning: [```.accept() => Promise```](./alert/accept.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.

:warning: [```.dismiss() => Promise```](./alert/dismiss.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.

:warning: [```.getText() => Promise<String>```](./alert/getText.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.

:warning: [```.typeText(text: String) => Promise```](./alert/typeText.md)

<img src="https://img.shields.io/badge/Platform-~All-blue.svg" />

TODO: Description here.

### Configuration

:warning: `appium.username: String?`

Username for server authentication - useful when connecting to cloud services such as SauceLabs or BrowserStack.

:warning: `appium.password: String?`

Password for server authentication - useful when connecting to cloud services such as SauceLabs or BrowserStack.

:warning: `plugins: Array<Function>?`

List of plugins to provide functionality throughout your test run.

:warning: `device.build: String?`

Build command to execute before running. Useful in local development and have access to the app source code.
