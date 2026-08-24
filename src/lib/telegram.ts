// Minimal Telegram WebApp helpers. The Mini App receives a signed initData
// string from Telegram; api.ts forwards it as the Authorization header.
interface TelegramWebApp {
  initData?: string;
}

function getWebApp(): TelegramWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

/** Raw initData string, or "" when running outside Telegram (browser preview). */
export function getInitData(): string {
  return getWebApp()?.initData ?? "";
}

/** True when the app is running inside the Telegram WebView. */
export function isTelegram(): boolean {
  return Boolean(getInitData());
}
