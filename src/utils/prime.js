export const generatePrimeNumber = (number) => {
  while (!isPrime(number)) { number++ }
  return number
}

const isPrime = number => {
  for (let i = 2; i < number; i++) { if (number % i === 0) return false }
  return number > 1
}
