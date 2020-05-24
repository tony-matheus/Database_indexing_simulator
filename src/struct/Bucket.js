
export default class Bucket {
  constructor(key, level = 0, settings) {
    this.key = level ? `${key.toString().split('_')[0]}_${level}` : key;
    this.level = level;
    this.content = {};
    this.space = settings.BUCKET_SIZE;
    this.bucketOverflow = null;
    this.count = 0;
    this.settings = settings
  }

  add = (pageKey, tupleKey) => {
    if (this.checkSpace()) {
      this.content[tupleKey] = pageKey;
      this.count++;
    } else this.overflow(pageKey, tupleKey);
  }

  get = (tuplaKey, access=1) =>
    this.content[tuplaKey] ?
      {
        bucketKey: this.key,
        pageKey: this.content[tuplaKey],
        tuplaKey,
        accessCost: access
      } :
      this.bucketOverflow.get(tuplaKey, access+1)

  size = () => Object.keys(this.content).length;

  checkSpace = () => this.count < this.space

  overflow = (pageKey, tupleKey) =>
    this.bucketOverflow ?
      this.bucketOverflow.add(pageKey, tupleKey) :
      this.createBucket(pageKey, tupleKey)

  createBucket = (pageKey, tupleKey) => {
    this.bucketOverflow = new Bucket(this.key, this.level + 1, this.settings);
    this.bucketOverflow.add(pageKey, tupleKey)
  }

  overflowCount = (count = 0) =>
    this.bucketOverflow ? this.bucketOverflow.overflowCount(count + 1) : count

  tuples = () => Object.keys(this.content)

  pages = () => Object.values(this.content)

  tuplesPages = () => {
    const indexes = this.tuples()
    return this.pages().map((pageKey, index) => ({ pageKey, tuplaKey: indexes[index]}))
  }

  collisionCount = () => this.count - 1

  getOverflowBuckets = (overflow = this.bucketOverflow, content = []) => {
    if(!overflow){
      return content
    }
    content.push(overflow)
    return this.getOverflowBuckets(overflow.bucketOverflow, content)
  }
}
