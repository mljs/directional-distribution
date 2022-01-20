import { DataXY } from 'cheminfo-types';
import sum from 'ml-array-sum';
import variance from 'ml-array-variance';
import covariance from 'ml-array-xy-covariance';
import { EigenvalueDecomposition } from 'ml-matrix';

/**
 * Calculates the Directional Ellipse for a set of points with a specific standard deviation
 * @param {DataXY} [points] - points is of type DataXY, points.x contins the x coordinates of the points, points.y contains the y coordinates of the points
 * @param {object} [options = {}]
 * @param {number} [options.nbSD = 2] - the number of standard deviations, nbSD = 1 will cover about 68% of the data, nbSD = 2 will cover about 95% of the data and nbSD = 3 will cover about 99.7% of the data
 */
export function getDirectionalEllipse(points: DataXY, options?: {nbSD: number}) {

  let nbSD = (typeof options !== 'undefined') ? options.nbSD : 2;

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
  let sampleCovarianceMatrix = [
    [centeredXVariance, centeredCovariance],
    [centeredCovariance, centeredYVariance],
  ];
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
  };
}
