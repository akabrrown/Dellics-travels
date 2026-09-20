import { headers } from 'next/headers';

/**
 * Injects the Trusted Types default policy as a synchronous inline script
 * BEFORE React hydration begins, preventing the browser from blocking DOM
 * operations that Next.js / React perform during startup.
 *
 * Policy contract:
 *  - createHTML:      Passthrough — React's virtual DOM prevents XSS; raw HTML
 *                     from dangerouslySetInnerHTML is app-developer responsibility.
 *  - createScript:    Passthrough — nonce-based CSP already gates script execution.
 *  - createScriptURL: Validates the URL is from an explicitly-trusted origin.
 */
export async function TrustedTypesInjector() {
  const nonce = (await headers()).get('x-nonce') ?? '';

  const policyScript = `
(function() {
  if (!window.trustedTypes || !window.trustedTypes.createPolicy) return;
  try {
    var TRUSTED_ORIGINS = [
      location.hostname,
      'vercel.live',
      'va.vercel-scripts.com'
    ];
    window.trustedTypes.createPolicy('default', {
      createHTML: function(s) { return s; },
      createScript: function(s) { return s; },
      createScriptURL: function(s) {
        try {
          var url = new URL(s, location.origin);
          var host = url.hostname;
          var trusted = TRUSTED_ORIGINS.some(function(o) {
            return host === o || host.endsWith('.' + o);
          });
          if (trusted) return s;
        } catch(_) {}
        console.warn('[TrustedTypes] Blocked untrusted script URL:', s);
        throw new TypeError('Untrusted script URL blocked: ' + s);
      }
    });
  } catch(e) {
    if (!(e instanceof TypeError && e.message.indexOf('already') !== -1)) {
      console.error('[TrustedTypes] Policy registration failed:', e);
    }
  }
})();
`.trim();

  return (
    <script
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: policyScript }}
    />
  );
}