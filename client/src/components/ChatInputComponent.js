import React, { useState, useRef } from 'react'
import { IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import StopIcon from '@mui/icons-material/Stop'

const ChatInputComponent = ({ onSend, onStop, loading, disabled, placeholder }) => {
    const [value, setValue] = useState('')
    const textareaRef = useRef(null)

    const handleChange = (e) => {
        setValue(e.target.value)
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
        }
    }

    const handleSend = () => {
        const trimmed = value.trim()
        if (!trimmed || disabled || loading) return
        onSend(trimmed)
        setValue('')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="inputArea">
            <div className={`inputWrap${disabled ? ' inputWrapDisabled' : ''}`}>
                <textarea
                    ref={textareaRef}
                    className="chatTextarea"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || loading}
                    rows={1}
                />
                {loading ? (
                    <IconButton
                        onClick={onStop}
                        sx={{ color: '#8fb996' }}
                    >
                        <StopIcon fontSize="small" />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={handleSend}
                        disabled={!value.trim() || disabled}
                        sx={{
                            color: value.trim() && !disabled ? '#8fb996' : 'rgba(240,234,214,0.25)',
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                )}
            </div>
        </div>
    )
}

export default ChatInputComponent
