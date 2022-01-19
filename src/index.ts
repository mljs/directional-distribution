import sum from 'ml-array-sum';
import variance from 'ml-array-variance';
import covariance from 'ml-array-xy-covariance';
import { Matrix, EigenvalueDecomposition } from 'ml-matrix';

/**
 * Calculates the Directional Ellipse for a set of points with a specific standard deviation
 * @param {object} [points]
 * @param {Array} [points.x]
 * @param {Array} [points.y]
 * @param {number} [nbSD=2]
 * @param {object} [props={fillColor='#FF0',fillOpacity=0.5,strokeWidth=0.00001,strokeColor='#F00',strokeDasharray=[1]}]
 */
export function getDirectionalEllipse(
  points: { x: number[]; y: number[] },
  nbSD = 2,
  props: {
    fillColor: string;
    fillOpacity: number;
    strokeWidth: number;
    strokeColor: string;
    strokeDasharray: number[];
  } = {
    fillColor: '#FF0',
    fillOpacity: 0.5,
    strokeWidth: 0.00001,
    strokeColor: '#F00',
    strokeDasharray: [1],
  },
) {
  let xCenter = sum(points.x) / points.x.length;
  let yCenter = sum(points.y) / points.y.length;

  let xCentered = points.x.map((x) => x - xCenter);
  let yCentered = points.y.map((y) => y - yCenter);

  let centeredXVariance = variance(xCentered, { unbiased: false });
  let centeredYVariance = variance(yCentered, { unbiased: false });

  let centeredCovariance = covariance(
    {
      x: xCentered,
      y: yCentered,
    },
    { unbiased: false },
  );

  //spectral decomposition of the sample covariance matrix
  let sampleCovarianceMatrix = new Matrix([
    [centeredXVariance, centeredCovariance],
    [centeredCovariance, centeredYVariance],
  ]);
  let e = new EigenvalueDecomposition(sampleCovarianceMatrix);
  let eigenvalues = e.realEigenvalues;
  let vectors = e.eigenvectorMatrix;

  let rMajor: number;
  let rMinor: number;
  let vectorMajor: number[];
  let vectorMinor: number[];

  if (eigenvalues[0] > eigenvalues[1]) {
    rMajor = Math.sqrt(eigenvalues[0] * nbSD);
    rMinor = Math.sqrt(eigenvalues[1] * nbSD);
    vectorMajor = vectors.getColumn(0);
    vectorMinor = vectors.getColumn(1);
  } else if (eigenvalues[0] < eigenvalues[1]) {
    rMajor = Math.sqrt(eigenvalues[1] * nbSD);
    rMinor = Math.sqrt(eigenvalues[0] * nbSD);
    vectorMajor = vectors.getColumn(1);
    vectorMinor = vectors.getColumn(0);
  } else {
    // order here does not matter
    rMajor = Math.sqrt(eigenvalues[1] * nbSD);
    rMinor = Math.sqrt(eigenvalues[0] * nbSD);
    vectorMajor = vectors.getColumn(1);
    vectorMinor = vectors.getColumn(0);
  }

  let majorAxisPoint1 = {
    x: xCenter + rMajor * vectorMajor[0],
    y: yCenter + rMajor * vectorMajor[1],
  };
  let majorAxisPoint2 = {
    x: xCenter - rMajor * vectorMajor[0],
    y: yCenter - rMajor * vectorMajor[1],
  };
  let minorAxisPoint1 = {
    x: xCenter + rMinor * vectorMinor[0],
    y: yCenter + rMinor * vectorMinor[1],
  };
  let minorAxisPoint2 = {
    x: xCenter - rMinor * vectorMinor[0],
    y: yCenter - rMinor * vectorMinor[1],
  };

  return {
    rMajor: rMajor,
    rMinor: rMinor,
    position: {
      x: xCenter,
      y: yCenter,
    },
    majorAxis: {
      point1: majorAxisPoint1,
      point2: majorAxisPoint2,
    },
    minorAxis: {
      point1: minorAxisPoint1,
      point2: minorAxisPoint2,
    },
    ...props,
  };
}
