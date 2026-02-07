import Parth from '../src';

describe('options', () => {
  it('default regex can be changed using options', () => {
    const parth = new Parth({ defaultRE: /\S+/ });
    const stems = 'do :src :dest';
    const path = 'do /src/**/*.js /dest/';

    const result = parth.set(stems).get(path)!;
    expect(result.notFound).toEqual('');
    expect(result.regex!.source).toMatch(/[\\]+S\+/);
  });
});
