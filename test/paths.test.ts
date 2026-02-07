import Parth from '../src';

describe('paths', () => {
  const parth = new Parth();
  let path: string;
  let match: string;

  function check(result: ReturnType<typeof parth.get>) {
    expect(result).toMatchObject({ path, match });
  }

  it('object', () => {
    path = 'hello.:there';
    match = 'hello.awesome';
    check(parth.set(path).get(match)!);
  });

  it('raw object paths', () => {
    match = path = 'hello.there';
    check(parth.set(path).get(match)!);
  });

  it('unix paths', () => {
    path = '/hello/:there/:you';
    match = '/hello/awesome/human';
    check(parth.set(path).get(match)!);
  });

  it('raw unix paths', () => {
    path = '/hello/there/you';
    match = '/hello/there/you?here';
    check(parth.set(path).get(match)!);
  });

  it('urls', () => {
    path = '/hello/:there';
    match = '/hello/awesome/?query';
    check(parth.set(path).get(match)!);
  });

  it('raw urls', () => {
    path = '/hello/there';
    match = '/hello/there/?query';
    check(parth.set(path).get(match)!);
  });

  it('urls: querystring is stripped', () => {
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    check(parth.set(path).get(match)!);
  });

  it('urls: hash is stripped', () => {
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there#hello';
    check(parth.set(path).get(match)!);
  });

  it('urls: parameters are not mistaken as querystrings', () => {
    path = 'get page.thing /hello/:here(?:\\w+you)';
    match = 'get page.thing /hello/helloyou';
    check(parth.set(path).get(match)!);
  });

  it('space separated paths', () => {
    path = 'you are an :there :you';
    match = 'you are an awesome human';
    check(parth.set(path).get(match)!);
  });

  it('raw, space separated paths', () => {
    match = path = 'you are an there you';
    check(parth.set(path).get(match)!);
  });

  it('unix, object and url paths together', () => {
    path = 'get page.:thing /hello/:there';
    match = 'get page.data /hello/awesome/?query';
    check(parth.set(path).get(match)!);
  });

  it('raw: unix, object and urls paths together', () => {
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    check(parth.set(path).get(match)!);
  });
});
