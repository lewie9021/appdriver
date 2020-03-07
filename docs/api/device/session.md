# `.session: Object`

Returns the session identifier and capabilities.

#### Returns

`Object`:
  - `sessionId` (`String`): Session identifier.
  - `capabilities` (`Object`): Session capabilities.

#### Examples

```javascript
(async () => {
  const { sessionId, capabilities } = device.session;

  console.log(sessionId);
  console.log(capabilities);
})();
```

#### Related Methods

- [`.name: String`](./name.md)
- [`.platform: Object`](./platform.md)
