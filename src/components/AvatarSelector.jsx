import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { RefreshCcw } from 'lucide-react';

const PRESET_COLORS = [
    '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0',
    '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A',
    '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726',
    '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'
];

const DEFAULT_EMOJIS = ['😀', '😎', '👻', '🤖', '👽', '🐼', '🦊', '🐱', '🐶', '🐯', '🦁', '🐵'];

const AvatarSelector = ({ selectedEmoji, setSelectedEmoji, selectedColor, setSelectedColor }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const randomizeAvatar = () => {
        const randomEmoji = DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)];
        const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        setSelectedEmoji(randomEmoji);
        setSelectedColor(randomColor);
    };

    return (
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
    );
};

export default AvatarSelector;
