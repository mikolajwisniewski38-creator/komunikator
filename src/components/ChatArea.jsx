import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { format } from 'date-fns';
import { Trash2, Reply, Paperclip, Smile, File, X, Globe, User, Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import UserAvatar from './UserAvatar';

const ChatArea = () => {
    const { user, messages, sendMessage, deleteMessage, activeChat, users } = useChat();
    const [input, setInput] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);

    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiRef = useRef(null);

    // Get chat partner info
    const chatPartner = activeChat ? users.find(u => u.id === activeChat) : null;

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter messages for current view
    // Global: recipientId is null or undefined
    // Private: (sender is me AND recipient is them) OR (sender is them AND recipient is me)
    const validMessages = messages.filter(m => {
        if (!m || (!m.text && !m.attachment)) return false;

        if (activeChat === null) {
            // Global chat - show public messages only
            return !m.recipientId;
        } else {
            // Private chat
            return (m.senderId === user.id && m.recipientId === activeChat) ||
                (m.senderId === activeChat && m.recipientId === user.id);
        }
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [validMessages]); // Depend on filtered messages

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() && !attachment) return;

        sendMessage(input, replyingTo ? replyingTo.id : null, attachment);

        setInput('');
        setReplyingTo(null);
        setAttachment(null);
        setShowEmoji(false);
        // Force scroll after send
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500000) { // 500KB limit for LocalStorage safety
            alert("File is too large (max 500KB for this demo)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setAttachment({
                type: file.type.startsWith('image/') ? 'image' : 'file',
                name: file.name,
                url: e.target.result
            });
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = null;
    };

    const onEmojiClick = (emojiObject) => {
        setInput(prev => prev + emojiObject.emoji);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--chat-bg)', position: 'relative' }}>

            {/* Header */}
            <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(22, 27, 34, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(10px)'
            }}>
                {activeChat === null ? (
                    <>
                        <div style={{ padding: '8px', background: 'var(--primary-color)', borderRadius: '50%' }}><Globe size={20} color="white" /></div>
                        <div>
                            <h2 style={{ fontSize: '16px', margin: 0 }}>Global Chat</h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Everyone can see messages here</p>
                        </div>
                    </>
                ) : (
                    <>
                        <UserAvatar user={chatPartner} size={32} showStatus={true} />
                        <div>
                            <h2 style={{ fontSize: '16px', margin: 0 }}>{chatPartner ? chatPartner.nickname : 'Unknown User'}</h2>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Private Conversation</p>
                        </div>
                    </>
                )}
            </div>

            {/* Messages List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {validMessages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20%' }}>
                        <p>No messages here yet. Say hello!</p>
                    </div>
                )}

                {validMessages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    const replyMsg = msg.replyToId ? messages.find(m => m.id === msg.replyToId) : null; // Look in full history for reply source

                    return (
                        <div key={msg.id} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                            animation: 'fadeIn 0.3s ease-out'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                marginBottom: '4px',
                                marginLeft: '8px',
                                marginRight: '8px'
                            }}>
                                {!isMe && (
                                    <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <UserAvatar
                                            user={users.find(u => u.id === msg.senderId)}
                                            size={28}
                                        />
                                        <span>{msg.senderId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="message-bubble" style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: '18px',
                                borderBottomRightRadius: isMe ? '4px' : '18px',
                                borderBottomLeftRadius: isMe ? '18px' : '4px',
                                background: isMe ? 'var(--message-sent-bg)' : 'var(--message-received-bg)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                                onMouseEnter={(e) => {
                                    const btns = e.currentTarget.querySelectorAll('.action-btn');
                                    btns.forEach(b => b.style.opacity = '1');
                                }}
                                onMouseLeave={(e) => {
                                    const btns = e.currentTarget.querySelectorAll('.action-btn');
                                    btns.forEach(b => b.style.opacity = '0');
                                }}
                            >
                                {replyMsg && (
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        borderLeft: '2px solid var(--primary-color)',
                                        paddingLeft: '6px',
                                        marginBottom: '4px',
                                        opacity: 0.8
                                    }}>
                                        Replying to {replyMsg.senderId}:<br />
                                        {replyMsg.attachment ? '[Attachment]' : replyMsg.text.substring(0, 30)}
                                    </div>
                                )}

                                {msg.attachment && msg.attachment.type === 'image' && (
                                    <img
                                        src={msg.attachment.url}
                                        alt="attachment"
                                        style={{ maxWidth: '200px', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => window.open(msg.attachment.url, '_blank')}
                                    />
                                )}

                                {msg.attachment && msg.attachment.type === 'file' && (
                                    <a
                                        href={msg.attachment.url}
                                        download={msg.attachment.name}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}
                                    >
                                        <File size={20} />
                                        <span style={{ fontSize: '12px' }}>{msg.attachment.name}</span>
                                    </a>
                                )}

                                {msg.text && <div>{msg.text}</div>}

                                <div style={{ position: 'absolute', top: '-10px', right: isMe ? '-10px' : 'auto', left: isMe ? 'auto' : '-10px', display: 'flex', gap: '4px' }}>
                                    {isMe && (
                                        <button
                                            className="action-btn"
                                            onClick={() => deleteMessage(msg.id)}
                                            style={{
                                                background: 'var(--danger-color)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                color: 'white'
                                            }}
                                            title="Delete message"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                    <button
                                        className="action-btn"
                                        onClick={() => setReplyingTo(msg)}
                                        style={{
                                            background: 'var(--border-color)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            color: 'white'
                                        }}
                                        title="Reply"
                                    >
                                        <Reply size={12} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', opacity: 0.7 }}>
                                {format(new Date(msg.timestamp), 'HH:mm')}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div >

            {/* Input Area */}
            < div style={{ padding: '20px', background: 'var(--sidebar-bg)', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
                {/* Context items (Reply, Attachment) */}
                < div style={{ display: 'flex', gap: '8px', marginBottom: (replyingTo || attachment) ? '10px' : '0' }}>
                    {replyingTo && (
                        <div style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <span>Replying to {replyingTo.senderId}</span>
                            <button onClick={() => setReplyingTo(null)} style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>✕</button>
                        </div>
                    )}
                    {
                        attachment && (
                            <div style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: 'rgba(88, 166, 255, 0.1)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: 'var(--primary-color)'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Paperclip size={12} /> {attachment.name}
                                </span>
                                <button onClick={() => setAttachment(null)} style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>✕</button>
                            </div>
                        )
                    }
                </div >

                <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            title="Attach File"
                        >
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />

                        <div style={{ position: 'relative' }} ref={emojiRef}>
                            <button
                                type="button"
                                onClick={() => setShowEmoji(!showEmoji)}
                                style={{ background: 'transparent', border: 'none', color: showEmoji ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
                                title="Add Emoji"
                            >
                                <Smile size={20} />
                            </button>
                            {showEmoji && (
                                <div style={{ position: 'absolute', bottom: '40px', left: '0', zIndex: 100 }}>
                                    <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} width={300} height={400} />
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        type="text"
                        className="input-field"
                        placeholder={activeChat ? `Message ${chatPartner?.nickname || 'User'}...` : "Message Global Chat..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{ borderRadius: '24px', paddingLeft: '20px' }}
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ borderRadius: '50%', width: '46px', height: '46px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        disabled={!input.trim() && !attachment}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div >
        </div >
    );
};

export default ChatArea;
