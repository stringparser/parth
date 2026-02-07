import Parth from '../src';

describe('normalization', () => {
  it('set trims and collapses whitespace in path', () => {
    const parth = new Parth();
    parth.set('  get   /hello/:there  ');
    const result = parth.get('get /hello/world');
    expect(result).not.toBeNull();
    expect(result!.params).toEqual({ there: 'world' });
  });

  it('get trims and collapses whitespace in input path', () => {
    const parth = new Parth().set('get /hello/:there');
    const result = parth.get('  get   /hello/world  ');
    expect(result).not.toBeNull();
    expect(result!.params).toEqual({ there: 'world' });
  });
});
