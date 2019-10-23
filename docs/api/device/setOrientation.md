# `.setOrientation(orientation: String) => Promise`

Change the orientation of the device to either `"LANDSCAPE"` or `"PORTRAIT"`.

#### Parameters

1. `orientation` (`String`): Can be either `"LANDSCAPE"` or `"PORTRAIT"`.

#### Returns

`Promise`: A promise that resolves once the orientation has been set.

#### Examples

Change orientation to landscape.

```javascript
(async () => {
  await device.setOrientation("LANDSCAPE");
})();
```

#### Related Methods

- [`.getOrientation() => Promise<String>`](./getOrientation.md)

### Related Appium Docs

- [Set Orientation](http://appium.io/docs/en/commands/session/orientation/set-orientation/)