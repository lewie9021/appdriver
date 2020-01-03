# `.setPortrait() => Promise`

Sets the device orientation to portrait.

#### Returns

`Promise`: A promise that resolves once the orientation has been set.

#### Examples

```javascript
(async () => {
  await device.setPortrait();
  await device.isPortrait(); // true
})();
```

#### Related Methods

- [`.isPortrait() => Promise<Boolean>`](./isPortrait.md)
- [`.setLandscape() => Promise`](./setLandscape.md)

### Related Docs

- [Set Orientation (Appium)](http://appium.io/docs/en/commands/session/orientation/set-orientation/)
- [Set Orientation (JSONWP)](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidorientation)