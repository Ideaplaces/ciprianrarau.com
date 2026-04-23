import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Extract the same logic from server-entry.mjs for unit testing
function hasMultiLevelEncoding(url) {
  try {
    const decoded = decodeURI(url);
    if (decoded !== url && /%[0-9a-fA-F]{2}/.test(decoded)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

describe('hasMultiLevelEncoding', () => {
  it('allows normal paths', () => {
    assert.equal(hasMultiLevelEncoding('/'), false);
    assert.equal(hasMultiLevelEncoding('/blog'), false);
    assert.equal(hasMultiLevelEncoding('/blog/my-post'), false);
    assert.equal(hasMultiLevelEncoding('/about'), false);
  });

  it('allows single-encoded paths', () => {
    assert.equal(hasMultiLevelEncoding('/path%20with%20spaces'), false);
    assert.equal(hasMultiLevelEncoding('/caf%C3%A9'), false);
  });

  it('rejects double-encoded paths', () => {
    // %252F decodes to %2F (which is still encoded)
    assert.equal(hasMultiLevelEncoding('/%252F'), true);
    // %2561dmin decodes to %61dmin (still has encoded char)
    assert.equal(hasMultiLevelEncoding('/%2561dmin'), true);
    // %2520 decodes to %20 (still encoded)
    assert.equal(hasMultiLevelEncoding('/path%2520name'), true);
  });

  it('rejects malformed encoding', () => {
    assert.equal(hasMultiLevelEncoding('/%ZZ'), true);
  });

  it('allows paths with query strings', () => {
    assert.equal(hasMultiLevelEncoding('/blog?page=1'), false);
    assert.equal(hasMultiLevelEncoding('/search?q=hello%20world'), false);
  });

  it('allows paths with hash fragments', () => {
    assert.equal(hasMultiLevelEncoding('/blog/post#section'), false);
  });
});
