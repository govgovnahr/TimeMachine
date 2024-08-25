import React, {useState} from 'react'

import SidebarComponent from './SidebarComponent.js';
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
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"

const ChatWindowComponent = () => {
    const [context, setContext] = useState([{'role': 'system', "content": 'Inform users that you can emulate persons from a time period and geopolitical region that they choose, try and gently steer them to the settings panel on the left.'}])
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

    const changeContext = (systemMessage) => {
        const newMessage = {
            'role': 'system',
            'content': systemMessage
        }
        setContext([newMessage])
        console.log("CONTEXT:   ", context)
        setMessages([])
    }

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
        <div className="mainBody" style={{display: 'flex', flexDirection:"row"}}>
            <SidebarComponent onContextChange={changeContext}/>
            <div className='chatWindow' style={{ position:"relative",height:'100vh', width: '120vw'}}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList 
                            scrollBehavior="smooth" 
                            typingIndicator={loading ? <TypingIndicator content="Your Mom is typing" /> : null}
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
        </div>
    )

}

export default ChatWindowComponent;