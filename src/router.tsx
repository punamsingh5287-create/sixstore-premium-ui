import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ApiError } from "./lib/api";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // A 4xx (not found, forbidden, bad request) means the request was
        // understood and rejected -- retrying sends the exact same request
        // and gets the exact same answer, just slower. Only retry things
        // that can plausibly succeed on a second try: network blips and
        // 5xx. api.ts's own request() already retries 502/503/504 with
        // backoff internally, so this is the outer safety net for
        // everything else (timeouts that exhausted their own retries,
        // transient DNS/connection failures).
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
