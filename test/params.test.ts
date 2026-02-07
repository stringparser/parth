import Parth from '../src';

describe('params', () => {
  const parth = new Parth();

  it('can be given as part of the input string', () => {
    const stem = 'post /:number(\\d+)';
    const path = 'post /1';
    const result = parth.set(stem).get(path);
    expect(result).toMatchObject({
      params: { number: '1' },
    });
  });

  it('may not contain labels', () => {
    const stem = '(get|post) /hello/:there/:you';
    const path = 'post /hello/awesome/10';
    const result = parth.set(stem).get(path);
    expect(result).toMatchObject({
      params: { '0': 'post', you: '10', there: 'awesome' },
    });
  });

  it('query fragment is setup by default for an url', () => {
    const stem = '(get|post) /hello/:there/:you';
    const path = 'post /hello/awesome/10?query=string#here';
    const result = parth.set(stem).get(path);
    expect(result).toMatchObject({
      params: {
        '0': 'post',
        you: '10',
        there: 'awesome',
        qs: '?query=string#here',
      },
    });
  });

  it('querystring may contain parameters', () => {
    const stem =
      'post /:page\\/?:query(\\?[^/#\\s]+)?:fragment(#[^?\\s]+)?';
    const path = 'post /page?query=here#hash';
    const result = parth.set(stem).get(path);
    expect(result).toMatchObject({
      params: {
        page: 'page',
        query: '?query=here',
        fragment: '#hash',
      },
    });
  });
});
