import React, {useState} from 'react'

import InputComponent from './InputComponent.js';
import {
    TextField,
    Button,
    InputBase,
    IconButton,
    Paper,
    Input,
} from '@mui/material'
import {
    Send
} from '@mui/icons-material'

const ChatWindowComponent = () => {
    const [messageList, setMessageList] = useState([]);

    const updateMessageList= (newMessage) => {
        setMessageList((prevList) => [...prevList, newMessage])
        console.log(messageList)
    }

    return (
        <div className="ChatWindow" sx={{display:'flex', alignItems:'center'}}>
            <h1>Item List</h1>
            <ul>
                {messageList.map((item, index) => (
                <li key={index}>{item[1]}</li>
                ))}
            </ul>
            <div style={{alignItems: 'center', alignContent:'center', justifyContent:'center'}}><InputComponent onMessageListChange={updateMessageList}/></div>
            
        </div>
    )

}

export default ChatWindowComponent;