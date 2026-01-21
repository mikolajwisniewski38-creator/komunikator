import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import AvatarSelector from './AvatarSelector';
import '../index.css';



const LoginPage = () => {
    const { login } = useChat();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    // Avatar State
    const [selectedEmoji, setSelectedEmoji] = useState('😎');
    const [selectedColor, setSelectedColor] = useState('#42A5F5');

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
                    <AvatarSelector
                        selectedEmoji={selectedEmoji}
                        setSelectedEmoji={setSelectedEmoji}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                    />

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
