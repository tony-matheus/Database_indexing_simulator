import React from 'react';
import logo from './logo.svg';
import './App.css';
import readTextFile from './utils/readFile'
import randomId from './utils/randomId'
function App() {

  React.useEffect(() => {
    // console.log(readTextFile())
    console.log(
      randomId(
        readTextFile()
      )
    )
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
