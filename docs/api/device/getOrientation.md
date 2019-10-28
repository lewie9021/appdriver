# `.getOrientation() => Promise<String>`

Retrieves the current orientation of the device.

#### Returns

`Promise` (`String`): Orientation of device. Will be either `"LANDSCAPE"` or `"PORTRAIT"`.

#### Examples

Get orientation of device.

```javascript
(async () => {
  const orientation = await device.getOrientation();
  console.log(orientation); // "PORTRAIT"
})();
```

#### Related Methods

- [`.setOrientation(orientation: String) => Promise`](./setOrientation.md)

### Related Appium Docs

- [Get Orientation](http://appium.io/docs/en/commands/session/orientation/get-orientation/)