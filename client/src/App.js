import React, {useState, useEffect} from 'react'
import './App.css';
import InputComponent from './components/InputComponent';

function App() {
  const [data, setData] = useState([{}])
  return (
    <div className="App">
      <h1>React Input Test</h1>
      <InputComponent/>
    </div>
  );
}

export default App;
