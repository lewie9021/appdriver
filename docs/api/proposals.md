# Proposals

This document contains API features that may eventually be implemented in the future.

### Device
 
:warning: [```.isReal: Boolean```](./device/isReal.md)

TODO: Description here.
 
:warning: [```.startScreenRecording(options?: {filePath?: String, remote? {username?: String, password?: String, method?: String}, format?: String, quality?: String, fps?: Number, bitRate?: Number, size?: {width: Number, height: Number}, maxDuration?: Number, forceRestart?: Boolean}) => Promise```](./device/startScreenRecording.md)

TODO: Description here.

:warning: [```.stopScreenRecording() => Promise```](./device/stopScreenRecording.md)

TODO: Description here.
 
:warning: [```.getGeoLocation() => Promise```](./device/getGeoLocation.md)

TODO: Description here.

:warning: [```.setGeoLocation(options: {latitude: Number, longitude: Number, altitude?: Number}) => Promise```](./device/setGeoLocation.md)

TODO: Description here.

:warning: [```.getClipboard(options? {contentType?: String}) => Promise<String>```](./device/getClipboard.md)

TODO: Description here.

:warning: [```.setClipboard(value: String, options?: {contentType?: String, label?: String}) => Promise```](./device/setClipboard.md)

TODO: Description here.

:warning: [```.toggleAirplaneMode() => Promise```](./device/toggleAirplaneMode.md)

TODO: Description here.

:warning: [```.toggleWifi() => Promise```](./device/toggleWifi.md)

TODO: Description here.

:warning: [```.toggleLocation() => Promise```](./device/toggleLocation.md)

TODO: Description here.

:warning: [```.performTouchId(options: {successful: Boolean}) => Promise```](./device/performTouchId.md)

TODO: Description here.

:warning: [```.performFingerPrint(options: {id?: Number}) => Promise```](./device/performFingerPrint.md)

TODO: Description here.

:warning: [```.sendSms({phoneNumber: String, message: String}) => Promise```](./device/sendSms.md)

TODO: Description here.

:warning: [```.getSettings() => Promise<Object>```](./device/getSettings.md)

TODO: Description here.

:warning: [```.setSettings(settings: Object) => Promise```](./device/setSettings.md)

TODO: Description here.

:warning: [```.readFile(filePath: String) => Promise<String>```](./device/readFile.md)

TODO: Description here.

:warning: [```.writeFile(filePath: String, data: String) => Promise```](./device/writeFile.md)

TODO: Description here.

### Element

:warning: [```.isSelected() => Promise<Boolean>```](./element/isSelected.md)

TODO: Description here.

:warning: [```.getAttribute(attribute: String) => Promise<Any>```](./element/getAttribute.md)

TODO: Description here.

:warning: [```.swipeIntoView(options: {element: Element, swipeGesture?: Gesture, safeArea?: {top?: Number, right?: Number, bottom?: Number, left?: Number}}) => Element```](./element/swipeIntoView.md)

To be used on scrollable elements, ensuring `element` is fully visible so that interactions are successful. Defaults `swipeGesture` to `gestures.swipeUp`.