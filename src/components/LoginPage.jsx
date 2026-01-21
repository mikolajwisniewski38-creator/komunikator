import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Lock, User, ArrowRight, RefreshCcw } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import '../index.css';

const PRESET_COLORS = [
    '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0',
    '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A',
    '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726',
    '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'
];

const DEFAULT_EMOJIS = ['😀', '😎', '👻', '🤖', '👽', '🐼', '🦊', '🐱', '🐶', '🐯', '🦁', '🐵'];

const LoginPage = () => {
    const { login } = useChat();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    // Avatar State
    const [selectedEmoji, setSelectedEmoji] = useState('😎');
    const [selectedColor, setSelectedColor] = useState('#42A5F5');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nickname.trim()) {
            setError('Nickname is required');
            return;
        }
        if (nickname.length < 3) {
            setError('Nickname must be at least 3 characters');
            return;
        }

        const avatar = {
            emoji: selectedEmoji,
            color: selectedColor
        };

        login(nickname, avatar);
    };

    const randomizeAvatar = () => {
        const randomEmoji = DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)];
        const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        setSelectedEmoji(randomEmoji);
        setSelectedColor(randomColor);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'radial-gradient(circle at top right, #1f2533 0%, #0d1117 100%)'
        }}>
            <div className="glass-panel" style={{ padding: '40px', width: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', display: 'inline-flex', padding: '15px', background: 'rgba(56, 139, 253, 0.1)', borderRadius: '50%' }}>
                    <Lock size={32} color="var(--primary-color)" />
                </div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Secure Login</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Customize your profile and enter</p>

                <form onSubmit={handleSubmit}>

                    {/* Avatar Selection Section */}
                    <div style={{ marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: selectedColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                {selectedEmoji}
                                {showEmojiPicker && (
                                    <div style={{ position: 'absolute', top: '90px', zIndex: 100 }}>
                                        <EmojiPicker
                                            theme="dark"
                                            width={300}
                                            height={350}
                                            onEmojiClick={(emojiData) => {
                                                setSelectedEmoji(emojiData.emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={randomizeAvatar}
                                className="action-btn"
                                style={{
                                    background: 'var(--sidebar-bg)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)'
                                }}
                                title="Randomize Avatar"
                            >
                                <RefreshCcw size={18} />
                            </button>
                        </div>

                        {/* Color Picker */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '300px', margin: '0 auto' }}>
                            {PRESET_COLORS.map(color => (
                                <div
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: color,
                                        cursor: 'pointer',
                                        border: selectedColor === color ? '2px solid white' : '2px solid transparent',
                                        boxShadow: selectedColor === color ? '0 0 0 2px var(--primary-color)' : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            placeholder="Enter nickname..."
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--danger-color)', fontSize: '14px', marginTop: '-10px', marginBottom: '15px', textAlign: 'left' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        Enter App <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
