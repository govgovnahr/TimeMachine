import React, {useState} from 'react';
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

const InputComponent = ({onMessageListChange}) => {
    const [input, setInput] = useState('');
    const [context, setContext] = useState([])
    const [loading, setLoading] = useState(false)


    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:5050/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({value: input, context: context}),
            });
            const data = await response.json();
            console.log("Response:  ", data.message);
            onMessageListChange(['assistant', data.message])
            setContext(data.context)
        } catch (error) {
            console.error("Error sending data to server:   ", error)
        } finally {
            setLoading(false)
        }
    };

    const handleKeyPress = (event) => {
        console.log(event.target.value)
        setInput(event.target.value)
        console.log(input)
        if (event.key === "Enter") {
            handleSend()
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSend()
        onMessageListChange(['user', input])
        setInput('')
    }

    return (
        <div>
            <Paper onSubmit={handleSubmit} component='form' sx={{width:400, justifyContent:'center'}}>
            <InputBase
                type="text"
                value={input}
                onChange={handleKeyPress}
                // onKeyPress={handleKeyPress}
                placeholder={loading? 'Cooking a response...': 'Enter text'}
                sx={{
                    p: '0px 20px 0px 20px'
                }}
                disabled={loading}
            />
                <IconButton onClick={handleSend} sx={{p:'10px 10px 10px 40px'}} aria-label='Send'><Send/></IconButton>
            
            {/* <Button onClick={handleSend} disableElevation>Send</Button> */}
            </Paper>
        </div>
    );
};

export default InputComponent;