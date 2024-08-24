import React, {useState} from 'react'

import InputComponent from './InputComponent.js';
import {
    TextField,
    Button,
    InputBase,
    IconButton,
    Paper,
    Input,
    Typography
} from '@mui/material'
import {
    Send
} from '@mui/icons-material'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"


const SidebarComponent = ({onContextChange}) => {
    const [region, setRegion] = useState("")
    const [year, setYear] = useState(2000)

    const handleSubmit = (event) => {
        console.log("Region",region)
        console.log("Year", year)
        event.preventDefault();
        let systemMessage = ''
        systemMessage = "You are a helpful, friendly, regular citizen of " + region + " in the year " + year.slice(0,4) + " . You are unaware of any events or technological advances that occurred after this date. Speak in a manner that aligns with these parameters. Keep the conversation light and educational; your goal is to inform whomever you may be speaking with about the era and region. Additionally, keep responses to 1-2 paragraphs in length."
        onContextChange(systemMessage)
    }

    const handleChangeRegion = (event) => {
        setRegion(event.target.value)
        console.log(region)
    }

    const handleChangeTime = (event) => {
        setYear(event.target.value)
        console.log(year)
    }


    return (
        <div style={{paddingTop: 40}}>
            <Typography variant="h4">Settings</Typography>
            <div className='inputRecipe' style={{alignItems: 'justify'}}>
                <Input onChange={handleChangeRegion} placeholder="Country/Region" sx={{color: 'white'}}/>
                <Input onInput={handleChangeTime} placeholder="Year" type='date'sx={{color: 'white'}}/>
                <IconButton onClick={handleSubmit} aria-label='Send'sx={{color: 'white'}}><Send/></IconButton>
            </div>
        </div>
    )
}

export default SidebarComponent