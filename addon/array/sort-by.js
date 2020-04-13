import sort from './sort';

export default function sortBy(array, key) {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string');
  }

  return sort(array, [key]);
}
