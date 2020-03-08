import { getRandomTupleKey, shuffle, createTupleKeys }  from './random'
import words from './words.txt'


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

const formatTuple = (words) => {
    const tuples = [];
    words.map(word => tuples.push({key:getRandomTupleKey(), value: word}))
    return  shuffle(tuples);
}

