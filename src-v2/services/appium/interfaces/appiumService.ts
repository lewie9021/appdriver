import { DesiredCapabilities } from "../../interfaces/appium";

export interface CreateSessionParams {
  capabilities: DesiredCapabilities;
}

export interface DeleteSessionParams {
  sessionId: string;
}