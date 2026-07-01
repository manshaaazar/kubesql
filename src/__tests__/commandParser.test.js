const { parse } = require('../helpers/commandParser');

test('parses a single key-value pair, stripping parentheses', () => {
  expect(parse('(name my-namespace)')).toEqual(['name my-namespace']);
});

test('parses multiple comma-separated key-value pairs', () => {
  expect(parse('(namespace default,port 3000)')).toEqual([
    'namespace default',
    'port 3000',
  ]);
});

test('parses three entries', () => {
  expect(parse('(namespace default,port 3000,image nginx:latest)')).toEqual([
    'namespace default',
    'port 3000',
    'image nginx:latest',
  ]);
});

test('handles missing opening paren', () => {
  expect(parse('name foo)')).toEqual(['name foo']);
});

test('handles missing closing paren', () => {
  expect(parse('(name foo')).toEqual(['name foo']);
});
