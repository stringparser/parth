import Parth from '../src';

describe('match priority', () => {
  it('deeper path wins over shallower when both match', () => {
    const parth = new Parth();
    parth.set('/:a').set('/:a/:b');
    const result = parth.get('/x/y');
    expect(result).not.toBeNull();
    expect(result!.path).toBe('/:a/:b');
    expect(result!.params).toEqual({ a: 'x', b: 'y' });
  });

  it('when depth is equal, stem localeCompare determines winner', () => {
    const parth = new Parth();
    parth.set('/foo/:id');
    parth.set('/bar/:id');
    expect(parth.get('/foo/1')).toMatchObject({ path: '/foo/:id', params: { id: '1' } });
    expect(parth.get('/bar/1')).toMatchObject({ path: '/bar/:id', params: { id: '1' } });
  });
});
