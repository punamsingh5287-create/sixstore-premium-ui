export const navSections = ["/", "/categories", "/orders", "/wallet", "/profile"] as const;

export function navIndexFor(pathname: string): number {
  if (pathname === "/") return 0;
  return navSections.findIndex((p) => p !== "/" && pathname.startsWith(p));
}
