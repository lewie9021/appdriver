export interface AppiumElement {
  ELEMENT: string;
  [key: string]: string;
}

export interface AppiumContext {
  id: string,
  title: string | null,
  url: string | null
}

export type PlatformName = "iOS" | "Android";

export type DesiredCapabilities =
  | {
      bundleId: string;
      app: string;
      derivedDataPath?: string;
      platformName: Extract<PlatformName, "iOS">;
      platformVersion: string;
      deviceName: string;
      automationName: "XCUITest";
      wdaLocalPort?: number;
      waitForQuiescence?: boolean;
      noReset?: boolean;
      fullContextList?: boolean;
    }
  | {
      appPackage: string;
      app: string;
      platformName: Extract<PlatformName, "Android">;
      platformVersion: string;
      deviceName: string;
      avd: string;
      automationName: "UiAutomator2";
      appActivity: string;
      systemPort?: number;
      noReset?: boolean;
      chromedriverExecutableDir?: string;
    };

export interface AppiumIOSCapabilities {
  bundleId: string;
  app: string;
  derivedDataPath?: string;
  platformName: Extract<PlatformName, "iOS">;
  platformVersion: string;
  deviceName: string;
  automationName: "XCUITest";
  wdaLocalPort?: number;
  waitForQuiescence?: boolean;
  noReset?: boolean;
  fullContextList?: boolean;
}

export interface AppiumAndroidCapabilities {
  appPackage: string;
  app: string;
  platformName: Extract<PlatformName, "Android">;
  platformVersion: string;
  deviceName: string;
  avd: string;
  automationName: "UiAutomator2";
  appActivity: string;
  systemPort?: number;
  noReset?: boolean;
  chromedriverExecutableDir?: string;
}

export type AppiumCapabilities = AppiumIOSCapabilities | AppiumAndroidCapabilities;