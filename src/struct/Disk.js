import { PAGE_SIZE, NUMBER_MAX_PAGES }  from '../utils/constants'
import Page from './Page';
import { createPageKeys, getRandomPageKey } from '../utils/random';

export default class Disk {
  
  constructor(tuples) {
    this.content = this.fillPage(tuples);
  }
  
  get = (pageKey, tupleKey) => this.content[pageKey].get(tupleKey)

  fillPage = (tuples) => {
    createPageKeys(PAGE_SIZE)
    let pages = {}

    while(tuples.length){
      pages[getRandomPageKey()] = new Page(tuples.splice(tuples.length - PAGE_SIZE, PAGE_SIZE))
    }

    return pages
  }
}
