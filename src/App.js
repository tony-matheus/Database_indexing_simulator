import React, { useEffect, useState } from 'react';
import './App.css';
import Disk from './struct/Disk'
import Hash from './struct/Hash'
import { getTable } from './utils/readFile'

function App() {

  const [input, setInput] = useState('')
  const [word, setWord] = useState('')
  const [tuples] = useState(getTable())
  const [disk] = useState(new Disk())
  const [hash] = useState(new Hash())

  const test = () => {
    const wordsError = [];
    tuples.map(tuple=> {
      if (!(disk.get(hash.get(tuple.key), tuple.key)===tuple.value)){
        wordsError.push({ key: tuple.key, correct: tuple.value, invalid: disk.get(hash.get(tuple.key), tuple.key)})
      }
    })
    console.log((1 - wordsError.length/tuples.length)*100+'% de acerto.')
    console.log(wordsError)
  }
  
  useEffect(() => {
    console.log(tuples)
    tuples.map(tuple=> disk.add(hash.add(tuple.key), tuple))
    test()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event) => setInput(event.target.value)
  const search = () => {
    setWord(disk.get(hash.get(input), input))
  }
  return (
    <div className="App">
      <header className="App-header">
          {word}
          <input type="text" value={input} onChange={handleChange} />
          <button onClick={search}>Pesquisar</button>
      </header>
    </div>
  );
}

export default App;
