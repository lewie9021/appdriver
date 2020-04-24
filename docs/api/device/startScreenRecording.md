# `.startScreenRecording(options?: Object) => Promise`

Starts recording the entire screen. See [`.stopScreenRecording`](./stopScreenRecording.md) to stop the recording.

#### Parameters

1. `options` (`Object?`):
    - `options.filePath` (`String?`): Absolute path on disk to store the recording once stopped.
    - `options.maxDuration` (`Number?`): Maximum recording time in seconds. Defaults to 180.
    - `options.forceRestart` (`Boolean?`): Immediately stop any recording that might be in progress.
    - `options.format` (`String?`): iOS only. Format of the video. Can be either `"h264"`, `"mpeg4"`, `"mp4"` or `"fmp4"`. Defaults to "mpeg4".
    - `options.quality` (`String?`): iOS only. Quality of the video. Can be either `"low"`, `"medium"`, or `"high"`. Defaults to "medium".
    - `options.fps` (`Number?`): iOS only. Frames per second of the video. Defaults to 10.
    - `options.size` (`Object?`):
      - `options.size.width` (`Number`): Android only. Width of the video.
      - `options.size.height` (`Number`): Android only. Height of the video.

#### Returns

`Promise`: A promise that resolves once the recording has successfully started.

#### Examples

Start a screen recording.

```javascript
const path = require("path");

(async () => {
  await device.startScreenRecording({ 
    filePath: path.join(__dirname, "videos", "example.mp4")
  });
})();
```

Optimised screen recording that automatically stops after 30 seconds.

```javascript
const path = require("path");

(async () => {
  await device.startScreenRecording({ 
    filePath: path.join(__dirname, "videos", "example.mp4"),
    maxDuration: 30,
    quality: "low",
    fps: 5,
    size: {
      width: 720,
      height: 480
    }
  });
})();
```

#### Known Issues

- In some cases the video that is returned isn't playable with particular versions of Appium and and combinations of parameters such as format. For instance, I found that using Appium `1.12.x` with a format of `mpeg4` would save a file that wasn't playable.

#### Related methods

- [`.takeScreenshot(options: Object) => Promise<Buffer>`](./takeScreenshot.md)
- [`.stopScreenRecording() => Promise<Buffer>`](./stopScreenRecording.md)

#### Related Docs

- [Start Recording Screen (Appium)](http://appium.io/docs/en/commands/device/recording-screen/start-recording-screen/)