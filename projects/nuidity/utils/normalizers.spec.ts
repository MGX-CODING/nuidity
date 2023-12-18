import {
  compareDates,
  normalizeDate,
  normalizeString,
  valiDate,
} from './normalizers';

describe('Normalizer utils', () => {
  it('Normalizes a string', () => {
    const input = '   a  a    a  aa     a';
    const expected = 'a a a aa a';
    expect(normalizeString(input)).toEqual(expected);
  });

  it('Normalizes a date', () => {
    expect(normalizeDate(new Date())).toEqual(
      new Date(new Date().setHours(12, 0, 0, 0))
    );
  });

  it('Compares dates', () => {
    expect(compareDates('', new Date())).toBeFalse();
    expect(compareDates(new Date(), '')).toBeFalse();
    expect(compareDates('', '')).toBeFalse();
    expect(
      compareDates(
        new Date(new Date().setHours(15)),
        new Date(new Date().setMinutes(27))
      )
    ).toBeTrue();
  });

  it('Validates dates', () => {
    expect(() => valiDate('', true)).toThrowError();
    expect(() => valiDate('', false)).not.toThrowError();
    expect(valiDate('', false)).toBeNull();
    expect(valiDate(Date.now())).toBeInstanceOf(Date);
    expect(valiDate(new Date())).toBeInstanceOf(Date);
    expect(valiDate(new Date().toISOString())).toBeInstanceOf(Date);
  });
});
