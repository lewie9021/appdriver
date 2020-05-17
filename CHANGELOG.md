# Change Log

## [Unreleased]

### Added

- Official AppDriver [website](https://lewie9021.github.io/appdriver/)!
- Support for `.getAttribute` on Element.
- Support for `.navigate` on Device.
- Support for `.toHaveAttribute` on Expect.

### Changed

- Renamed `.toBeGreaterThan` to `.toBeMoreThan` on Expect.
- Renamed `.toBeGreaterThanOrEqual` to `.toBeMoreThanOrEqual` on Expect.

## [v1.0.0-beta.1] - 2020-05-02

### Added

- Support for `.getRef` on Element.
- Support for `.session` and `.execute` on Device.
- Support for interacting with native alerts via `alert`.
- Support for resolving promise values with `.toHaveLength`, `.toBeTruthy` and `.toBeFalsy` on Expect.
- Support for passing options to `.findElement` and `.findElements` on Element.
- Support for [configuring](./docs/api/configuration.md) timeouts when finding elements via `findInterval` and `findTimeout`.
- Support for alerts with `.toHaveText` and `.toBeVisible` on Expect.

### Changed

- Modified `maxSpecRetries` default configuration to 2 (previously 3), meaning each spec now executes up to 3 times.
- Renamed `waitForInterval` configuration to `waitInterval`.
- Renamed `waitForTimeout` configuration to `waitTimeout`.

## [v1.0.0-alpha.20] - 2020-03-06

### Added

- Support for `.setValue`, `.isFocused` and `.waitToBeFocused` on Element.
- Support for `.toBeFocused` on Expect.
- Summary bar to basic reporter, showing totals of specs and devices.
- ESLint to ensure code style consistency.

### Changed

- Modified `.typeText` to use W3C actions on Android to mimic similar behaviour to iOS.
- Element `.getValue` and `.toHaveValue` on Expect no longer takes an 'options' object to handle sliders. This has now moved to `element` and `elements`.

## [v1.0.0-alpha.19] - 2020-02-25

### Added

- Support for `.doubleTap` on Element.
- Support for composing gestures via `.series` and `.parallel`.
- Support for `.spread`, `.pinch` and `.doubleTap` gestures.
- Documented `.dragAndDrop` gesture.

### Changed

- Converted `.moveTo`, `.press`, `.release` and `.wait` into gestures.

## [v1.0.0-alpha.18] - 2020-02-15

### Changed

- Replaced `.platformName` and `platformVersion` on Device with `.platform`.
- Improved error messages when finding elements fail.
- Modified matchers to defer transformation until required to avoid throwing on creation.

### Fixed

- Gestures now correctly calculate relative `x` and `y` params from the top left of the element instead of the center point. 

## [v1.0.0-alpha.17] - 2020-02-05

### Added

- Support for `.getContext`, `.getContexts`, `.switchContext`, `.switchToWebContext` and `switchToNativeContext` on Device.
- Support for `by.xPath` and `by.css` Matchers.
- Support for `.isSelected` on Element.
- Support for `.toBeSelected` on Expect.

## [v1.0.0-alpha.16] - 2020-01-02

### Changed

- Replaced `.getOrientation` on Device with `.isPortrait`.
- Replaced `.setOrientation` on Device with `.setPortrait` and `.setLandscape`.

## [v1.0.0-alpha.15] - 2019-12-23

### Added

- Support for `by.type`, `by.iosPredicate` and `by.uiAutomator` Matchers.

### Changed

- `.hideKeyboard` now polls the visibility status of the keyboard to ensure it's hidden once the command has resolved. 

## [v1.0.0-alpha.14] - 2019-12-14

### Added

- Support for `.takeScreenshot`, `.tapReturnKey` and `.tapBackspaceKey` on Element.

### Changed

- `by.id`, `by.label` and `by.text` Matchers to instead accept regex instead of a custom fuzzy matching syntax.

## [v1.0.0-alpha.13] - 2019-12-06

### Added

- Support for `.not`, `.toBeTruthy`, `toBeFalsy`, `toBeLessThan`, `toBeLessThanOrEqual`, `toBeGreaterThan` and `toBeGreaterThanOrEqual` on Expect.
- Support for `.waitFor` on Device.

### Changed

- `.toHaveText` on Expect now accepts a regex value to assert against.
- Wait errors to include most recent error and matcher to improve debugging experience.

## [v1.0.0-alpha.12] - 2019-11-27

### Added

- Support for resetting / restarting the application between specs.
- Support for passing a `recursive` option to .getText on Element. 

### Changed

- Implemented the newly documented configuration format. This now supports defining timeouts, test retries, language (e.g. `describe` & `it`), and reporters.
- `restartApp` on Device now uses Appium's activate and terminate commands to be more intuitive.
- `resetApp` and `restartApp` on Device no longer require a capabilities parameter.
- Simple reporter to include the relative spec file path alongside the test name.

## [v1.0.0-alpha.11] - 2019-11-19

### Changed

- Major internal refactoring to greatly improve error handling and testability.
- `.wait` for gestures now simply takes a duration value just like `.wait` on Device.

### Fixed

- `.findElement` on Element correctly support chaining methods that apply to the newly found element. 
- Console logs and errors not showing during test runs.

## [v1.0.0-alpha.10] - 2019-10-30

### Added

- Support for `.startScreenRecording` and `.stopScreenRecording` on Device.
- Support for multiple `capabilities` in the config.
- Support for parallel testing via `maxInstances` option (defaults to 1) in the config to limit the maximum number of concurrent instances. New instances will spawn as soon as capabilities have finished if the number of capabilities is larger than `maxInstances`.
- Related Appium links to each element and device method docs.

## [v1.0.0-alpha.9] - 2019-10-23

### Added

- Support for passing a `percentage` option to `.swipeUp`, `.swipeDown`, `.swipeLeft` and `.swipeRight` on Element.
- Support for passing `x` and `y` options to `.tap` on Element.
- Support for Device `.goBack`.
- 'Platforms' badge to each Device and Element command.

## [v1.0.0-alpha.8] - 2019-10-21

### Added

- Support for Element `.swipe`, `.swipeUp`, `.swipeDown`, `.swipeLeft` and `.swipeRight`.
- Support for Device `.swipe`.

## [v1.0.0-alpha.7] - 2019-10-19

### Added

- Support for Expect `.toBeDisabled` and `.toMatch`.
- Support for Element `.isDisabled`.

## [v1.0.0-alpha.6] - 2019-10-14

### Changed

- README to include notice around issue with XCUITest in Xcode 11.
- Improved `.getValue` to return a boolean for buttons with values of '1' or '0'. 

### Added

- Support for Device `.takeScreenshot`.

## [v1.0.0-alpha.5] - 2019-06-24

### Added

- Support for `.toExist` expectation.
- Initial support for Element `.getAttribute` method. It maintains the warning status due to difficulty understanding the need for it and potential changes in the future to reduce platform checking code (e.g. `displayed` on Android vs `visible` on iOS).
- Support for Element `.findElement` and `.findElements`.
- Support for Element `.hideKeyboard` and `.isKeyboardVisible`.

## [v1.0.0-alpha.4] - 2019-06-15

### Added

- Support for `.toEqual` expectation.
- Support for device `.name`, `.platformName`, and `.platformVersion` properties.
- Support for Element `.exists` method.
- Support for Element `.waitFor`, `.waitToNotExist` and `.waitToBeInvisible`.

### Changed

- Device `.wait` method to accept a `duration` parameter instead of `options` object.
- Element `.isVisible` to return `false` in cases where the element doesn't exist.
- Element `.waitToExist` and `.waitToBeVisible` to accept `options.maxDuration` instead of `options.maxRetries`.

## [v1.0.0-alpha.3] - 2019-05-24

### Added

- NPM version badge to README.
- Status badges to methods to improve development visibility.

### Changed

- Began refactoring tests to instead mock at the fetch level.
- Confirmed function signature of `.waitFor` method.
- Confirmed `.platformName`, `.platformVersion`, and `.name` properties.
- `.startScreenRecording` method to accept `filePath`, simplifying `.stopScreenRecording`.
- `.setClipboard` method to accept `value` as its first parameter.
- `.readFile` and `.writeFile` methods to no longer nests parameters within an object.

## [v1.0.0-alpha.2] - 2019-05-17

### Added

- Dedicated documentation for several element and device methods.
- Support for `by.text` matcher.
- Repository details in `package.json` file.
- Documentation for utilities such as `setTestId` and `selectPlatform`.

### Changed

- The `getValue` method now returns consistent values across platforms for many native components.
- The `getText` method is now a little more intuitive, allowing nested text to be retrieved from elements.
- Retrieving session is no longer accessible via a global variable, but instead through the session module. 
- Cleaned up README.

### Fixed

- Demo GIF not loading correctly on NPM.

## [v1.0.0-alpha.1] - 2019-05-10

- Initial released!
