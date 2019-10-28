# `.getSize() => Promise<Object>`

Retrieves width and height dimensions of element.

#### Returns

`Promise` (`Object`):
  - `width` (`Number`): Width of element.
  - `height` (`Number`): Height of element.

#### Examples

Get width and height of button:

```javascript
(async () => {
  const { width, height} = await element(by.label("button"))
    .getSize();
})();
```

#### Related methods

- [`.getLocation(options?: Object) => Promise<Object>`](./getLocation.md)

### Related Appium Docs

- [Get Element Size](http://appium.io/docs/en/commands/element/attributes/size/)