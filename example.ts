import Parth from './src';

const parth = new Parth();

// #set
const input = [
  '/',
  '/page',
  '/page/:number(\\d+)',
  'get /',
  'get /page',
  'get /:page',
  'get :page/:view',
  'get /:page/:view',
  'get /page/:number(\\d+)',
  'get /:page(\\w+)/number',
  'get /:page(\\w+)/:number(\\d+)',
  '(get|post) /page/number',
  '(get|post) /:page(\\w+)/number',
  '(get|post) /:page(\\w+)/:Number(\\d+)',
  'get /page/number',
  '(get|post) /:page(\\w+)/:view([^.\\/\\s]+)',
  '1',
  '2',
  '1 2',
  'obj.path',
  'obj.:path(\\S+).:number(\\d+)',
  'obj.:number(\\d+).:path(\\S+)',
  'obj.path.:here',
  'obj.(prop|path).:here',
  ':obj.(method|prop).:here',
];

input.forEach((stem) => {
  parth.set(stem);
});

// #get
const getInput = [
  '1',
  '2',
  '1 2',
  'obj.path.10',
  'obj.10.prop',
  'obj.10.10',
  'array.method.prop',
  'get weekend/baby?query=string#hash user.10.beers',
  'get /weekend/baby?query=string#hash user.10.beers now',
  'get /user/view/#hash',
  'post /user/page/photo?query=name&path=tree#hash',
];

console.log(' -- parth.get -- ');
getInput.forEach((stem, index) => {
  const result = parth.get(stem);
  console.log(' input =', stem);
  console.log('result =', result);
  console.log(getInput[index + 1] ? ' -- ' : '');
});
