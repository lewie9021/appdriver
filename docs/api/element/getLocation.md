# `.getLocation(options?: Object) => Promise<Object>`

Retrieves x and y coordinates of element.

#### Parameters

1. `options` (`Object?`):
  - `options.relative` (Boolean?): Determines if the location should be calculated relative to the viewpoint. Defaults to false.

#### Returns

`Promise` (`Object`):
  - `x` (`Number`): x coordinate of element.
  - `y` (`Number`): y coordinate of element.

#### Examples

Absolute x and y coordinates of element:

```javascript
(async () => {
  const { x, y } = await element(by.label("box"))
    .getLocation();
})();
```

Relative x and y coordinates of element:

```javascript
(async () => {
  const { x, y } = await element(by.label("box"))
    .getLocation({relative: true});
})();
```

#### Related methods

- [`.getSize() => Promise<Object>`](./getSize.md)

### Related Appium Docs

- [Get Element Location](http://appium.io/docs/en/commands/element/attributes/location/)
- [Get Element Location In View](http://appium.io/docs/en/commands/element/attributes/location-in-view/)