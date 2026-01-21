import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Users, LogOut, Globe } from 'lucide-react';
import UserAvatar from './UserAvatar';

const Sidebar = () => {
    const { users, user: currentUser, logout, activeChat, selectChat } = useChat();
    const [now, setNow] = useState(new Date());

    // Update relative time every minute
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatus = (lastActiveIso) => {
        if (!lastActiveIso) return { text: 'Offline', color: 'var(--offline-color)' };

        const lastActive = parseISO(lastActiveIso);
        const diffInSeconds = (now - lastActive) / 1000;

        if (diffInSeconds < 60) {
            return { text: 'Active now', color: 'var(--active-color)' };
        }
        return {
            text: `Active ${formatDistanceToNow(lastActive, { addSuffix: true })}`,
            color: 'var(--text-secondary)'
        };
    };

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            height: '100%',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--sidebar-bg)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                    Kominukator
                </h1>
                <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> {users.length} Users Online
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                <div style={{
                    padding: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Channels
                </div>

                {/* Global Chat Item */}
                <div
                    onClick={() => selectChat(null)}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        background: activeChat === null ? 'var(--primary-color)' : 'transparent',
                        color: activeChat === null ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background 0.2s'
                    }}
                >
                    <Globe size={18} />
                    <span style={{ fontWeight: 500 }}>Global Chat</span>
                </div>

                <div style={{
                    padding: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: '10px'
                }}>
                    Direct Messages
                </div>

                {users.filter(u => u.id !== currentUser?.id).map(u => {
                    const status = getStatus(u.lastActive);
                    const isActive = activeChat === u.id;

                    return (
                        <div
                            key={u.id}
                            onClick={() => selectChat(u.id)}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '4px',
                                background: isActive ? 'rgba(88, 166, 255, 0.2)' : 'transparent',
                                border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <UserAvatar user={u} size={32} showStatus={true} />
                                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {u.nickname}
                                    </span>
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                {status.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: '15px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ marginBottom: '10px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <UserAvatar user={currentUser} size={24} /> Logged in as <b>{currentUser?.nickname}</b>
                </div>
                <button
                    onClick={logout}
                    className="btn-primary"
                    style={{ background: 'var(--danger-color)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
