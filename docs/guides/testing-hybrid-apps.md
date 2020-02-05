# Testing Hybrid Apps

Example:

```javascript
const { device, element, by } = "appdriver";

(async () => {
  await device.getContext(); // "NATIVE_APP".
  await element(by.label("button")).tap();

  await device.switchToWebContext();
  await device.getContext(); // "WEBIVEW_X".

  await element(by.css(`input[type="text"]`))
    .typeText("Hello World!");

  await device.switchToNativeContext();
  await device.getContext(); // "NATIVE_APP".
})();
```