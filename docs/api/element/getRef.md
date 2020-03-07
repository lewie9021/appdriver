# `.getRef() => Promise<Object>`

Retrieves the element reference.

#### Returns

`Promise` (`Object`): Appium element reference.

#### Examples

```javascript
(async () => {
  await element(by.label("button"))
    .getRef(); // { "element-6066-11e4-a52e-4f735466cecf": "31000000-0000-0000-CC4E-000000000000", "ELEMENT": "31000000-0000-0000-CC4E-000000000000" }
})();
```