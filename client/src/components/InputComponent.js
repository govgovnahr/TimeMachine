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
            onMessageListChange({sender:'assistant', message: data.message, direction: 'incoming'})
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
        onMessageListChange({sender:'user',message: input, direction: 'outgoing'})
        setInput('')
    }

    return (
        <div>
            <Paper onSubmit={handleSubmit} component='form' sx={{ p:'10px 0px 10px 0px', width:400,flex: 1, justifyContent:'center', backgroundColor: "#40414f"}}>
            <InputBase
                type="text"
                value={input}

                autoFocus={true}
                onChange={handleKeyPress}
                // onKeyPress={handleKeyPress}
                placeholder={loading? 'Llama is typing...': 'Enter text'}
                sx={{
                    color: "white"
                    
                }}
                disabled={loading}
            />
                <IconButton onClick={handleSend} sx={{ right:-50, color: "white", backgroundColor: 'cyan'}} aria-label='Send'><Send/></IconButton>
            
            {/* <Button onClick={handleSend} disableElevation>Send</Button> */}
            </Paper>
        </div>
    );
};

export default InputComponent;