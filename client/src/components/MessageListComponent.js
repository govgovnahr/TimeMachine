import React, { useEffect, useRef } from 'react'

function TypingBubble() {
    return (
        <div className="messageRow incoming">
            <div className="messageBubble incoming typingBubble">
                <span className="typingDot" style={{ animationDelay: '0s' }} />
                <span className="typingDot" style={{ animationDelay: '0.15s' }} />
                <span className="typingDot" style={{ animationDelay: '0.3s' }} />
            </div>
        </div>
    )
}

function EmptyState({ configLabel }) {
    return (
        <div className="emptyState">
            <span className="emptyStateIcon">{configLabel ? '🗺️' : '⏳'}</span>
            <p className="emptyStateText">
                {configLabel ? `Speaking as a citizen of ${configLabel}` : 'Choose a time period to begin'}
            </p>
            {configLabel && <p className="emptyStateSubtext">Send a message to start the conversation</p>}
        </div>
    )
}

const MessageListComponent = ({ messages, loading, configLabel }) => {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    return (
        <div className="messageListOuter">
            <div className="messageListInner">
                {messages.length === 0 && !loading && <EmptyState configLabel={configLabel} />}
                {messages.map((msg, i) => (
                    <div key={i} className={`messageRow ${msg.direction}`}>
                        <div className={`messageBubble ${msg.direction}`}>{msg.message}</div>
                    </div>
                ))}
                {loading && <TypingBubble />}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

export default MessageListComponent
