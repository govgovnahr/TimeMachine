import React, {useState} from 'react';

const InputComponent = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('')

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = async () => {

        try {
            const response = await fetch("http://localhost:5000/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({value: input}),
            });
            const data = await response.json();
            console.log("Response:  ", data);
            setOutput(data)
        } catch (error) {
            console.error("Error sending data to server:   ", error)
        }
    };

    const handleKeyPress = (event) => {
        console.log(event.target.value)
        console.log(input)
        if (event.key === "Enter") {
            handleSend()
        }
    }

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder='Enter text'
            />
            <button onClick={handleSend}>Send</button>
            <p>Current Value: {output}</p>
        </div>
    );
};

export default InputComponent;