# `.waitFor(condition: (element: Element) => Promise, options?: {interval?: Number, maxDuration?: Number}) => Element`

#### Parameters

1. `condition` (Function):
  - `element` (Element): Reference to current element to apply assertions against.
  - `[ReturnType]` (Promise): Returning a Promise that rejects will trigger a retry until successfully resolving or exceeding `options.maxDuration`.
2. `options` (Object?):
  - `options.interval` (Number?): Duration in milliseconds to wait between polling. Defaults to 200.
  - `options.maxDuration` (Number?): Max duration in milliseconds to poll before throwing. Defaults to 10000.

#### Returns

`Element`: A new element to avoid mutation and allow function chaining.

#### Examples

TODO: Examples here.

#### Related methods

- [`.waitToBeVisible(options?) => Element`](./waitToBeVisible.md)
- [`.waitToExist(options?) => Element`](./waitToExist.md)
- [`.waitToBeInvisible(options?) => Element`](./waitToBeInvisible.md)
- [`.waitToNotExist(options?) => Element`](./waitToNotExist.md)
