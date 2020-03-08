import { PAGE_SIZE, NUMBER_MAX_PAGES }  from '../utils/constants'
import Page from './Page';

export default class Disk {
  
  constructor() {
    this.content = this.loadPages();
  }

  add = (pageKey, tuple) => this.content[pageKey].add(tuple)
  
  get = (pageKey, tupleKey) => this.content[pageKey].get(tupleKey)

  loadPages = () => {
    const pages = {}
    for (let i=1; i<NUMBER_MAX_PAGES+1; i++)
      pages[i] = new Page(PAGE_SIZE)
    return pages
  }
}
