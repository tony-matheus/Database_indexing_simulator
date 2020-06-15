import { createPageKeys, getRandomPageKey } from '../utils/random';
import Page from './Page';
import Hash from './Hash'

export default class Disk {

  constructor(tuples, settings, pk, biggerPk) {
    this.settings = settings;
    this.content = this.fillPage(tuples, pk);
    this.hash = new Hash(tuples, settings, pk);
    this.biggerPk = biggerPk;
    this.addAllInHash();
  }

  add = (pageKey, tuple) => this.content[pageKey].add(tuple);
  get = (tupleKey) =>  {
    const address = this.hash.get(tupleKey)
    return address && this.content[address.pageKey].get(tupleKey);
  } 

  getAllPageKeys = () => Object.keys(this.content);

  addAllInHash = () =>
    this.getAllPageKeys().map(pageKey => this.getAllTupleKeys(pageKey)
    )

  getAllTupleKeys = (pageKey) => {
    this.content[pageKey].getAllTupleKeys().map(tupleKey => {
      return this.hash.add(pageKey, tupleKey)
    })
  }

  fillPage = (tuples, pk) => {
    createPageKeys(this.settings.NUMBER_MAX_PAGES);
    const t = tuples.slice();
    let pages = {};
    while (t.length) {
      const key = getRandomPageKey();
      pages[key] = new Page(
        t.splice(t.length - this.settings.PAGE_SIZE, this.settings.PAGE_SIZE),
        key,
        pk
      );
    }
    return pages;
  }

}
