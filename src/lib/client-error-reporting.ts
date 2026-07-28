// Real production telemetry for browser-side failures. `reportLovableError`
// (lib/lovable-error-reporting.ts) only forwards to window.__lovableEvents /
// window.__lovableReportRuntimeError, which are present *only* inside the
// Lovable editor preview -- in the deployed app (real Telegram users) those
// hooks don't exist, so nothing was ever reaching a log anywhere. This module
// posts to the backend's /api/store/client-log instead, which lands in the
// same journalctl -u digitalhub stream as every other server-side error.

const ENDPOINT = "/api/store/client-log";
const MAX_REPORTS_PER_SESSION = 20;
let reportCount = 0;
let initialized = false;

type ClientLogLevel = "error" | "unhandledrejection" | "network";

interface ClientLogPayload {
  level: ClientLogLevel;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
}

function send(payload: ClientLogPayload): void {
  if (typeof window === "undefined") return;
  if (reportCount >= MAX_REPORTS_PER_SESSION) return;
  reportCount += 1;

  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(ENDPOINT, blob);
      if (ok) return;
    }
  } catch {
    // fall through to fetch
  }
  // keepalive lets this survive a page unload/navigation, same as sendBeacon.
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Reporting failure itself must never surface to the user or throw.
  });
}

function describe(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack?.slice(0, 4000) };
  }
  if (error instanceof Response) {
    return { message: `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` };
  }
  try {
    return { message: JSON.stringify(error).slice(0, 2000) };
  } catch {
    return { message: String(error).slice(0, 2000) };
  }
}

export function reportRuntimeError(error: unknown, level: ClientLogLevel = "error"): void {
  if (typeof window === "undefined") return;
  const { message, stack } = describe(error);
  send({
    level,
    message,
    stack,
    url: window.location.pathname,
    userAgent: navigator.userAgent,
  });
}

/** GET requests that exhaust their retries, or any request that fails with a
 * genuine network/timeout error -- distinct from a plain 4xx, which is
 * normal application behaviour (not an infra failure worth alerting on). */
export function reportNetworkFailure(path: string, detail: string): void {
  reportRuntimeError(new Error(`network failure on ${path}: ${detail}`), "network");
}

/** Call once, client-side only, as early as the root component mounts.
 * Catches everything React's own error boundary can't: errors thrown
 * outside the render tree (event handlers, timers, unhandled promise
 * rejections) and JS bundle chunks that fail to load. */
export function initClientErrorReporting(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("error", (event) => {
    reportRuntimeError(event.error ?? event.message, "error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportRuntimeError(event.reason, "unhandledrejection");
  });
}
