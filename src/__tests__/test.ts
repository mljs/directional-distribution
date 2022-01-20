import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { getDirectionalEllipse } from '..';

expect.extend({ toBeDeepCloseTo });

describe('getDirectionalEllipse', () => {
  it('should return an annotation', () => {
    let result = getDirectionalEllipse(
      {
        x: [1, 2, 3, 4, 5, 6],
        y: [1, 4, 2, 5, 3, 6],
      },
      3,
    );

    expect(result).toBeDeepCloseTo(
      {
        rMajor: 3.872983346207417,
        rMinor: 1.5811388300841902,
        position: { x: 3.5, y: 3.5 },
        majorAxis: {
          point1: { x: 6.238612787525831, y: 6.238612787525831 },
          point2: { x: 0.7613872124741694, y: 0.7613872124741694 },
        },
        minorAxis: {
          point1: { x: 4.618033988749895, y: 2.381966011250105 },
          point2: { x: 2.381966011250105, y: 4.618033988749895 },
        },
      },
      1,
    );
  });
});
