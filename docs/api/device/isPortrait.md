# `.isPortrait() => Promise<Boolean>`

Returns whether the device is in a portrait or landscape orientation.

#### Returns

`Promise` (`Boolean`): Whether orientation of device is portrait or landscape.

#### Examples

Check if the device is in a portrait orientation.

```javascript
(async () => {
  const portrait = await device.isPortrait();
  console.log(portrait); // true
})();
```

#### Related Methods

- [`.setPortrait() => Promise`](./setPortrait.md)
- [`.setLandscape() => Promise`](./setLandscape.md)

#### Related Appium Docs

- [Get Orientation](http://appium.io/docs/en/commands/session/orientation/get-orientation/)