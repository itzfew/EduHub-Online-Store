interface Cashfree {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget: string;
    returnUrl: string;
  }): void;
}

interface Window {
  Cashfree: new (config: { mode: string }) => Cashfree;
}
