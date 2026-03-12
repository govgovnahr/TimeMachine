import React from 'react'
import './App.css';
import ChatWindowComponent from './components/ChatWindowComponent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App() {
    return (
    <div className="App" style={{flexDirection: 'row'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ChatWindowComponent/>
        </LocalizationProvider>
    </div>
    )
}

export default App;
