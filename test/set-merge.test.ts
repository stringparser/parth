import Parth from '../src';

describe('set merge', () => {
  it('setting same path twice merges options into existing entry', () => {
    const parth = new Parth();
    parth.set('/hello/:id');
    parth.set('/hello/:id', { path: '/hello/:id' });
    const result = parth.get('/hello/42');
    expect(result).not.toBeNull();
    expect(result!.params).toEqual({ id: '42' });
  });

  it('set(path, opt) passes optional PathOpt into stored entry', () => {
    const parth = new Parth();
    parth.set('/a', { path: '/a', custom: 'value' } as unknown as { path?: string; custom?: string });
    const result = parth.get('/a');
    expect(result).not.toBeNull();
    expect((result as { custom?: string })!.custom).toBe('value');
  });
});
