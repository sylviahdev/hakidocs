interface Pendo {
  track(event: string, properties?: Record<string, unknown>): void;
}

declare global {
  // eslint-disable-next-line no-var
  var pendo: Pendo | undefined;
}

export {};
