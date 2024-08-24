import React, {useState, useEffect} from 'react'
import './App.css';
import InputComponent from './components/InputComponent';
// import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatWindowComponent from './components/ChatWindowComponent';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

function App() {
    
    // write get code
    

    
    return (
    <div className="App" sx={{flexDirection: 'row'}}>
        <ChatWindowComponent/>
    </div>
    )
}

export default App;
