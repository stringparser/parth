import { getQueryString } from '../src/lib';

describe('lib getQueryString', () => {
  it('returns null for null or undefined url', () => {
    expect(getQueryString(null)).toBeNull();
    expect(getQueryString(undefined)).toBeNull();
  });

  it('returns null when url has no ?', () => {
    expect(getQueryString('http://example.com/path')).toBeNull();
  });

  it('returns query string from ? to end when ? is present', () => {
    expect(getQueryString('http://example.com?foo=1')).toBe('?foo=1');
    expect(getQueryString('/path?query=string')).toBe('?query=string');
  });

  it('returns null when ? is followed by : (so ?: is not a query string)', () => {
    expect(getQueryString('get /path?:optional')).toBeNull();
  });
});
