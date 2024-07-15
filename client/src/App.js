import React, {useState, useEffect} from 'react'
import './App.css';
import InputComponent from './components/InputComponent';
// import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatWindowComponent from './components/ChatWindowComponent';

function App() {
  const [data, setData] = useState([{}])
  return (
    <div className="App" style={{alignItems:'center', justifyContent:'center'}}>
      <ChatWindowComponent/>
    </div>
  );
}

export default App;
