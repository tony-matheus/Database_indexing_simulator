import { getRandomTupleKey, shuffle, createTupleKeys, getRandomPageKey }  from './random'
import _ from 'lodash'
import words from './wordsTest.txt'


export const  getTable = () => formatTuple(readTextFile())

export const readTextFile = () => {
    const file = words
    let rawFile = new XMLHttpRequest();
    let allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    allText = allText.split('\n')
    createTupleKeys(allText.length)
    return allText
}

export const formatTuple = async (words) => {
    // words.map(word => tuples.push({key:getRandomTupleKey(), value: word}))
    const tuples = words.map(word => ({key: getRandomTupleKey(), value: word}))
    const shuffled = await _.shuffle(tuples)
    return shuffled
}

