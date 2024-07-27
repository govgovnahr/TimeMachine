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


import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const ChatWindowComponent = () => {
    const [context, setContext] = useState([])
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([]);
    
    const handleSend = async (message) => {
        console.log(messages)
        const newMessage = {
            sender: 'user',
            message: message,
            direction: 'outgoing',
            };
        const temp = [...messages, newMessage]
        setMessages(temp)
        console.log("Messages" , messages)
        setLoading(true)
        await getMessage(temp)
        
    };

    async function getMessage(chatMessages) {
        try {
            const response = await fetch("http://localhost:5050/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({value: chatMessages[chatMessages.length - 1].message, context: context}),
            });
            const data = await response.json();
            console.log("Response:  ", data.message);
            const gptMessage = {sender:'assistant', message: data.message, direction: 'incoming'}
            setMessages(prevMessages => [...prevMessages, gptMessage]);
            console.log(messages)
            setContext(data.context)
        } catch (error) {
            console.error("Error sending data to server:   ", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='chatWindow' style={{ position:"relative", height: '100vh'}}>
        <MainContainer>
            <ChatContainer>
            <MessageList 
                scrollBehavior="smooth" 
                typingIndicator={loading ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
                {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
                })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
        </MainContainer>
        </div>
    )

}

export default ChatWindowComponent;