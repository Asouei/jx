declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, props);
  window.fbq?.('trackCustom', event, props);
}

export function buildOutboundUrl(target: string) {
  if (typeof window === 'undefined') return target;
  const params = new URLSearchParams(window.location.search);
  const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  try {
    const out = new URL(target);
    utms.forEach((k) => {
      const v = params.get(k);
      if (v) out.searchParams.set(k, v);
    });
    return out.toString();
  } catch {
    return target;
  }
}
