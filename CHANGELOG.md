# Change Log

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