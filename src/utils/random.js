const tupleKeys = [];
const pageKeys = [];

export const createTupleKeys = (size) => createRandomKeys(size, tupleKeys)
export const createPageKeys = (size) => createRandomKeys(size, pageKeys)
export const getRandomTupleKey = () => tupleKeys.pop()
export const getRandomPageKey = () => pageKeys.pop()

const createRandomKeys = (size, storage) => {
  for (let i=1; i<=size; i++) 
    storage.push(i)
  shuffle(storage);
}

export const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
