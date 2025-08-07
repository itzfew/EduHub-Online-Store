interface Cashfree {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget: string;
    returnUrl: string;
  }): void;
}

interface Window {
  Cashfree: (config: { mode: string }) => Cashfree;
}
