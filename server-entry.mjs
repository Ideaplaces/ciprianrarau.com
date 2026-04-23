/**
 * Custom server entry point that rejects double-encoded URLs before they
 * reach Astro's core, preventing ERROR-level log noise from bot/scanner
 * traffic. Without this wrapper, double-encoded URLs (e.g. %252F) pass
 * the basic decodeURI check in @astrojs/node's standalone handler but
 * then trigger validateAndDecodePathname in Astro core, which logs at
 * ERROR level and causes false production alerts.
 *
 * This wrapper returns 400 for double-encoded URLs instead of letting
 * them through to be logged as errors.
 */

import http from 'node:http';

// Prevent the built-in standalone server from auto-starting.
// We create our own HTTP server below with the additional URL validation.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';

const entry = await import('./dist/server/entry.mjs');

/**
 * Detects whether a URL contains multi-level (double) encoding.
 * A URL like /%252Fadmin decodes to /%2Fadmin on the first pass,
 * which still contains percent-encoded sequences.
 */
function hasMultiLevelEncoding(url) {
  try {
    const decoded = decodeURI(url);
    if (decoded !== url && /%[0-9a-fA-F]{2}/.test(decoded)) {
      return true;
    }
    return false;
  } catch {
    // Malformed encoding
    return true;
  }
}

const server = http.createServer((req, res) => {
  if (hasMultiLevelEncoding(req.url)) {
    res.writeHead(400);
    res.end('Bad request.');
    return;
  }
  entry.handler(req, res);
});

const port = parseInt(process.env.PORT, 10) || 4321;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
