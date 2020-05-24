import {getRandomTupleKey, shuffle, createTupleKeys} from './random';
import words from './words';

export const getTable = () => formatTuple(readTextFile());

export const readTextFile = () => {
  const array = words.split('\n');
  createTupleKeys(array.length);
  return array;
};

export const dataSize = () =>  words.split('\n').length

const formatTuple = words => {
  const tuples = [];
  words.map(word => tuples.push({key: getRandomTupleKey(), value: word}));
  return shuffle(tuples);
};
