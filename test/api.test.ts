import Parth from '../src';

describe('api', () => {
  describe('invalid inputs', () => {
    it('set(non-string) returns this and does not add a route', () => {
      const parth = new Parth();
      const chain = parth.set('get /:id').set(123 as unknown as string);
      expect(chain).toBe(parth);
      expect(parth.get('get /1')).toMatchObject({ params: { id: '1' } });
      expect(parth.get('123')).toBeNull();
    });

    it('get(non-string) returns null', () => {
      const parth = new Parth().set('get /:id');
      expect(parth.get(123 as unknown as string)).toBeNull();
      expect(parth.get(null as unknown as string)).toBeNull();
      expect(parth.get(undefined as unknown as string)).toBeNull();
    });
  });

  describe('no match', () => {
    it('get(path) returns null when no route matches', () => {
      const parth = new Parth().set('get /:id');
      expect(parth.get('post /1')).toBeNull();
      expect(parth.get('get')).toBeNull();
      expect(parth.get('')).toBeNull();
    });
  });

  describe('exact store match', () => {
    it('get(path) when path is exact registered path returns early with empty notFound and params', () => {
      const parth = new Parth().set('get /hello/:there');
      const exactPath = 'get /hello/:there';
      const result = parth.get(exactPath);
      expect(result).not.toBeNull();
      expect(result!.match).toBe(exactPath);
      expect(result!.notFound).toBe('');
      expect(result!.params).toEqual({});
    });
  });

  describe('constructor', () => {
    it('can be called with no options', () => {
      const parth = new Parth();
      parth.set('/:a');
      expect(parth.get('/x')).toMatchObject({ params: { a: 'x' } });
    });
  });

  describe('result immutability', () => {
    it('get() returns a clone; mutating result does not affect store', () => {
      const parth = new Parth().set('/:id');
      const result1 = parth.get('/foo');
      const result2 = parth.get('/foo');
      expect(result1!.params.id).toBe('foo');
      result1!.params.id = 'mutated';
      expect(result2!.params.id).toBe('foo');
    });
  });
});
