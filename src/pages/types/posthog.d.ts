// src/types/posthog.d.ts
export {};

declare global {
  interface Window {
    posthog: any;
  }

  var posthog: any;
}
