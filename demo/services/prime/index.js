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
    // Will grab prime numbers for a given range. This will run across multiple processes
    // at once and combined by the "render" service
    const { start, end } = data.body;
    // We recieve this from the "render" service, calculate the list of prime numbers
    // and return them back to its origin.
    const listOfPrimeNumbers = getPrimeList(start, end);
    // Notice all functions recieve the same arguments to make writing operations
    // easier.
    return sendSuccess({
      result: listOfPrimeNumbers
    });
  }
};
