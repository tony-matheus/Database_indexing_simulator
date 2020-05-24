export default class Page {

  constructor (content, key, pk) {
    console.warn(pk)
    this.key = key;
    this.name = 'Page ' + key;
    this.content = this.format(content, pk);
  }

  format = (content, pk) => {
    const formated = {};
    content.map(line => {
      const tuple =  line
      formated[tuple[pk]] = tuple
    });
    return formated;
  }

  get = (key) => this.content[key];
  add = (tuple) => this.content[tuple.key] = tuple.value;
  getAllTupleKeys = () => Object.keys(this.content);
}
