import pkg from 'parth';
const Parth = pkg.default ?? pkg;

const p = new Parth();

// Basic set/get
p.set('(get|post) /:page/:view');
const result = p.get('get /weekend/baby?query=string#hash');
if (!result) throw new Error('Expected match');
if (result.params?.page !== 'weekend') throw new Error('Expected params.page');
if (result.params?.view !== 'baby') throw new Error('Expected params.view');
if (!result.params?.qs?.includes('query=string')) throw new Error('Expected params.qs');

// Options
const p2 = new Parth({ defaultRE: /\S+/ });
p2.set('do :src :dest');
const r2 = p2.get('do /src/**/*.js /dest/');
if (!r2) throw new Error('Expected match with custom defaultRE');

console.log('Smoke test passed');
