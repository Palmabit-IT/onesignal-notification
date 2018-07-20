const { isArrayString } = require('./utils');

describe('Utils', () => {
  describe('isArrayString', () => {
    const invalidArray = [{}, 'a string', () => {}];
    const invalidArray2 = [() => {}];
    const invalidArray3 = [{}];

    const validArray = ['string'];
    const validArray2 = ['string1', 'string2', 'string3'];
    const validArray3 = ['', ''];

    test('invalid array of strings to be false', () => {
      expect(isArrayString(invalidArray)).toBe(false);
      expect(isArrayString(invalidArray2)).toBe(false);
      expect(isArrayString(invalidArray3)).toBe(false);
    });

    test('invalid array of strings to true', () => {
      expect(isArrayString(validArray)).toBe(true);
      expect(isArrayString(validArray2)).toBe(true);
      expect(isArrayString(validArray3)).toBe(true);
    });
  });
});
