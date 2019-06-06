# `.swipeUp(options: Object) => Promise`

Performs a swipe up gesture in the context of the device viewport.

#### Parameters

1. `options` (Object):
  - `options.x` (Number?): X coordinate to begin the gesture from. Defaults to 0.
  - `options.y` (Number?): Y coordinate to begin the gesture from. Defaults to 0.
  - `options.distance` (Number?): Distance of swipe in density independent pixels (DIP). Required if `percentage` isn't provided.
  - `options.percentage` (Number?): Percentage distance (0-1) of swipe relative to the height of the viewport. Required if `distance` isn't provided. 
  - `options.duration` (Number?): Time in milliseconds to perform the swipe gesture.

#### Returns

`Promise`: A promise that resolves after the gesture is complete.

#### Examples

TODO: Examples here.
