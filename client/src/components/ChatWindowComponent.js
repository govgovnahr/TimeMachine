import React, {useState, useRef} from 'react'

import SidebarComponent from './SidebarComponent.js'
import MessageListComponent from './MessageListComponent.js'
import ChatInputComponent from './ChatInputComponent.js'
import { Drawer, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

const SIDEBAR_WIDTH = 320
const BREAKPOINT = `(max-width: ${SIDEBAR_WIDTH + 360 - 1}px)`

const ChatWindowComponent = () => {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [isConfigured, setIsConfigured] = useState(false)
    const [configLabel, setConfigLabel] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Stored as refs so getMessage always reads the latest value without stale closures
    const sessionIdRef = useRef(null)
    const systemPromptRef = useRef(null)
    const abortControllerRef = useRef(null)

    const isMobile = useMediaQuery(BREAKPOINT)

    // Creates a new session on the server with the given system prompt.
    // The server stores the conversation history — the client only tracks the session ID.
    const createSession = async (systemPrompt) => {
        const res = await fetch("http://localhost:5050/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ system_prompt: systemPrompt }),
        })
        const data = await res.json()
        sessionIdRef.current = data.session_id
    }

    const handleSend = async (message) => {
        const newMessage = { sender: 'user', message, direction: 'outgoing' }
        const temp = [...messages, newMessage]
        setMessages(temp)
        setLoading(true)
        await getMessage(temp)
    }

    const handleStop = () => {
        abortControllerRef.current?.abort()
    }

    const handleNewChat = async () => {
        abortControllerRef.current?.abort()
        setMessages([])
        setLoading(false)
        // Start a fresh session with the same time period
        if (systemPromptRef.current) {
            await createSession(systemPromptRef.current)
        }
    }

    const changeContext = async (systemMessage, label) => {
        systemPromptRef.current = systemMessage
        setIsConfigured(false)
        setMessages([])
        setConfigLabel(label)
        setDrawerOpen(false)
        await createSession(systemMessage)
        setIsConfigured(true)
    }

    async function getMessage(chatMessages) {
        const abortController = new AbortController()
        abortControllerRef.current = abortController
        let bubbleAdded = false

        try {
            const response = await fetch("http://localhost:5050/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: chatMessages[chatMessages.length - 1].message,
                    session_id: sessionIdRef.current,
                }),
                signal: abortController.signal,
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || 'Server error')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop()

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue
                    const parsed = JSON.parse(line.slice(6))

                    if (parsed.error) {
                        if (!bubbleAdded) {
                            setMessages(prev => [...prev, { sender: 'assistant', message: '⚠️ ' + parsed.error, direction: 'incoming' }])
                            bubbleAdded = true
                        } else {
                            setMessages(prev => {
                                const updated = [...prev]
                                updated[updated.length - 1] = { sender: 'assistant', message: '⚠️ ' + parsed.error, direction: 'incoming' }
                                return updated
                            })
                        }
                    } else if (parsed.content) {
                        if (!bubbleAdded) {
                            setMessages(prev => [...prev, { sender: 'assistant', message: parsed.content, direction: 'incoming' }])
                            bubbleAdded = true
                            setLoading(false)
                        } else {
                            setLoading(false)
                            setMessages(prev => {
                                const updated = [...prev]
                                updated[updated.length - 1] = {
                                    ...updated[updated.length - 1],
                                    message: updated[updated.length - 1].message + parsed.content,
                                }
                                return updated
                            })
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') return
            console.error("Error sending data to server:", error)
            if (!bubbleAdded) {
                setMessages(prev => [...prev, { sender: 'assistant', message: '⚠️ ' + error.message, direction: 'incoming' }])
            } else {
                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { sender: 'assistant', message: '⚠️ ' + error.message, direction: 'incoming' }
                    return updated
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mainBody">
            {isMobile ? (
                <>
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{position: 'absolute', top: 8, left: 8, zIndex: 10, color: '#f0ead6'}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        PaperProps={{sx: {backgroundColor: '#22252e', width: SIDEBAR_WIDTH}}}
                    >
                        <SidebarComponent onContextChange={changeContext} />
                    </Drawer>
                </>
            ) : (
                <SidebarComponent onContextChange={changeContext} />
            )}
            <div className='chatWindow'>
                {messages.length > 0 && (
                    <Tooltip title="Restart conversation" placement="left">
                        <IconButton
                            onClick={handleNewChat}
                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, color: 'rgba(240,234,214,0.35)', '&:hover': { color: '#f0ead6' } }}
                        >
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                <MessageListComponent messages={messages} loading={loading} configLabel={configLabel} />
                <ChatInputComponent
                    onSend={handleSend}
                    onStop={handleStop}
                    loading={loading}
                    disabled={!isConfigured}
                    placeholder={isConfigured ? "Type message here" : "Set your time period in the sidebar to begin"}
                />
            </div>
        </div>
    )
}

export default ChatWindowComponent;
