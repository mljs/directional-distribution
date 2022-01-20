# ml-directional-distribution

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Calculate the directional distribution from points.

## Installation

`$ npm i ml-directional-distribution`

## Usage

You can call getDirectionalEllipse on two arrays x and y containing the x and y coordinates of the points for which you want to find the directional ellipse. It is also possible to specify the number of standard deviations nbSD. If nbSD is 1, the ellipse will cover about 68% of the points, if nbSD is 2, the ellipse will cover about 95% of the points and if nbSD is 3, the ellipse will cover about 99% of the points.

The return type contains the following data:

- rMajor is the radius of the major axis
- rMinor is the radius of the minor axis
- (position.x, position.y) are the coordinates of the center of the ellipse
- majorAxis.point1 and majorAxis.point2 are the coordinates of the extremities of the major axis
- minorAxis.point1 and minorAxis.point2 are the coordinates of the extremities of the minor axis

```js
import { getDirectionalEllipse } from 'ml-directional-distribution';

let { rMajor, rMinor, position, majorAxis, minorAxis } = getDirectionalEllipse(
  {
    x: [1, 2, 3, 4, 5, 6],
    y: [1, 4, 2, 5, 3, 6],
  },
  { nbSD: 3 },
);
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-directional-distribution.svg
[npm-url]: https://www.npmjs.com/package/ml-directional-distribution
[ci-image]: https://github.com/mljs/ml-directional-distribution/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/mljs/ml-directional-distribution/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/ml-directional-distribution.svg
[codecov-url]: https://codecov.io/gh/mljs/ml-directional-distribution
[download-image]: https://img.shields.io/npm/dm/ml-directional-distribution.svg
[download-url]: https://www.npmjs.com/package/ml-directional-distribution
