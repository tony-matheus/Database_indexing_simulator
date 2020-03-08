export default class Page {

  constructor () {
    this.content = {}
  }

  get = (key) => this.content[key]
  add = (tuple) => this.content[tuple.key] = tuple.value
}
