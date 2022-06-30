export const getAverage = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export const getInterestRate = (profit, cost) => (profit / cost) * 100;

export const getAverageInterestRate = (arr) =>
  getAverage(arr.map(({ profit, cost }) => getInterestRate(profit, cost)));
