import { AppiumCapabilities } from "../../interfaces/appium";

export interface CreateSessionParams {
  capabilities: AppiumCapabilities;
}

export interface DeleteSessionParams {
  sessionId: string;
}