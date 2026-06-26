export function AppShell({ children }) {
  // AppShell now just passes through children.
  // The header is implemented per-page (e.g. WorkspacePage) for better customization.
  return <>{children}</>;
}
