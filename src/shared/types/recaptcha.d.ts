export {}

declare global {
  interface Window {
    onSubmit?: (token: string | null) => void
    expiredCallback?: () => void
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: () => void
      reset: () => void
    }
  }
}
