# `.setLandscape() => Promise`

Sets the device orientation to landscape.

#### Returns

`Promise`: A promise that resolves once the orientation has been set.

#### Examples

```javascript
(async () => {
  await device.setLandscape();
  await device.isPortrait(); // false
})();
```

#### Related Methods

- [`.isPortrait() => Promise<Boolean>`](./isPortrait.md)
- [`.setPortrait() => Promise`](./setPortrait.md)

#### Related Docs

- [Set Orientation (Appium)](http://appium.io/docs/en/commands/session/orientation/set-orientation/)
- [Set Orientation (JSONWP)](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidorientation)