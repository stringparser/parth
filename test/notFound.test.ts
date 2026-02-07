import Parth from '../src';

describe('notFound', () => {
  const parth = new Parth();

  it('should be empty string for perfect match', () => {
    const stems = ':method(get) /hello/:there';
    const path = 'get /hello/awesome?query#hash';

    const result = parth.set(stems).get(path);
    expect(result).not.toEqual(null);
    expect(result!.notFound).toEqual('');
  });

  it('should have what is left of the path', () => {
    const stems = ':method(get) /hello/:there';
    const path = 'get /hello/awesome/human';
    const result = parth.set(stems).get(path);
    expect(result).not.toEqual(null);
    expect(result!.notFound).toEqual('human');
  });
});
