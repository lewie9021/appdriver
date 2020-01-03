# `.getViewport() => Promise<Object>`

Retrieves the width and height of the device viewport.

#### Returns

`Promise` (`Object`):
  - `width` (`Number`): Width of device viewpoint.
  - `height` (`Number`): Height of device viewpoint.

#### Examples

Get viewport size of device (e.g. iPhone X).

```javascript
(async () => {
  const viewport = await device.getViewport();
  console.log(viewport); // { "width": 375, "height": 812 }
})();
```
