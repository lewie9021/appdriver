const isNativeTextInput = (type) => {
  return [
    "android.widget.EditText",
    "XCUIElementTypeTextField"
  ].includes(type);
};

const isNativeSlider = (type) => {
  return [
    "android.widget.SeekBar",
    "XCUIElementTypeSlider"
  ].includes(type);
};

const isNativeSwitch = (type) => {
  return [
    "android.widget.Switch",
    "XCUIElementTypeSwitch"
  ].includes(type);
};

module.exports = {
  isNativeTextInput,
  isNativeSlider,
  isNativeSwitch
};