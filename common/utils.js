const random = (min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

const isOdd = (num) => {
  return num % 2 !== 0;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { random, isOdd, sleep };