function getPrimeList(min, max) {
  const sieve = [];
  let i;
  let j;
  const primes = [];
  for (i = 2; i <= max; ++i) {
    if (!sieve[i]) {
      // i has not been marked -- it is prime
      if (i >= min) {
        primes.push(i);
      }
      for (j = i << 1; j <= max; j += i) {
        sieve[j] = true;
      }
    }
  }
  return primes;
}

module.exports = {
  getPrimeListFromRange: ({ sendSuccess, data }) => {
    const { start, end } = data.body;
    // Will calculate prime numbers for a given number range.
    const listOfPrimeNumbers = getPrimeList(start, end);
    // Send the result back to its source
    return sendSuccess({
      result: listOfPrimeNumbers
    });
  }
};
