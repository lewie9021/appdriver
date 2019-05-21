# `.waitToBeVisible(options?: {interval?: Number, maxDuration?: Number}) => Element`

A handy `.waitFor` preset method for cases when elements may not be visible until some time in the future.

#### Parameters

1. `options` (Object?):
  - `options.interval` (Number?): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (Number?): Max duration in milliseconds to poll for before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

TODO: Examples here.

#### Related methods

- [`.waitFor(factory, options?) => Element`](./waitFor.md)
- [`.waitToExist(options?) => Element`](./waitToExist.md)
- [`.waitToBeInvisible(options?) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?) => Element`](./waitToNotExist.md)
