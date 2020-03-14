import { NUMBER_MAX_PAGES }  from '../utils/constants'
import Bucket  from './Bucket'
import { createPageKeys }  from '../utils/random'

export default class Hash {

  constructor() {
    createPageKeys(NUMBER_MAX_PAGES)
    this.prime = this.generatePrimeNumber(NUMBER_MAX_PAGES);
    this.table = new Array(NUMBER_MAX_PAGES);
  }

  add = (tupleKey) => {
    const key = this.function(tupleKey)
    if(!this.table[key]) this.table[key] = new Bucket();
    return this.table[key].pageKey
  }

  get = (key) => this.table[this.function(key)].pageKey

  function = (key) => key % this.prime

  generatePrimeNumber = (number) => {
    for (let currentNumber= number + 1; currentNumber > 2; currentNumber--)
      if(this.isPrime(currentNumber)) return currentNumber
  }
  
  isPrime = number => {
    for(let i = 2; i < number; i++)
      if (number % i === 0) return false;
    return number > 1;
  }

}
