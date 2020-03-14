export default class Page {

  constructor (content) {
    this.content = content
  }

  get = (key) => this.content[key]
  add = (tuple) => this.content[tuple.key] = tuple.value

  //todo object treatment func
}
