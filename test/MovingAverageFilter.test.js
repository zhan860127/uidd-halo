import { MovingAverageFilter } from '../assets/ts/MovingAverageFilter';

test('MovingAverageFilter', () => {
  const maf = new MovingAverageFilter(5);
  expect(maf.input(1)).toBe(1);
  expect(maf.input(3)).toBe(2);
  expect(maf.input(5)).toBe(3);
  expect(maf.input(3)).toBe(3);
  expect(maf.input(18)).toBe(6);
  expect(maf.input(-4)).toBe(5);
});
