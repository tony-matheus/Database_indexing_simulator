import { getRandomPageKey }  from '../utils/random'

export default class Bucket {
  constructor ({id}) {
    this.id = id
    this.name = 'bucket ' + id
    this.pageKey = getRandomPageKey();
  }
}
