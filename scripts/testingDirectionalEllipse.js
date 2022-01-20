const DE = require('../lib/index.js');

let { rMajor, rMinor, position, majorAxis, minorAxis, props } =
  DE.getDirectionalEllipse(
    {
      x: [1, 2, 3, 4, 5, 6],
      y: [1, 4, 2, 5, 3, 6],
    },
    { nbSD: 3 },
  );

console.log('The radius of the major axis is : ', rMajor);
console.log('The radius of the minor axis is : ', rMinor);
console.log('The (x,y) position of the ellipse is : ', position);
console.log('The point one of the major axis is : ', majorAxis.point1);
console.log('The point two of the major axis is : ', majorAxis.point2);
console.log('The point one of the minor axis is : ', minorAxis.point1);
console.log('The point two of the minor axis is : ', minorAxis.point2);
