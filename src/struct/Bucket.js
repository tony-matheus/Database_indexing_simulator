import { getRandomPageKey }  from '../utils/random'

export default class Bucket {
  constructor () {
    this.pageKey = getRandomPageKey();
  }
}