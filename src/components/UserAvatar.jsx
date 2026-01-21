import React from 'react';

const UserAvatar = ({ user, size = 40, showStatus = false, isSelf = false }) => {
    // Default avatar if none exists
    const avatar = user?.avatar || { emoji: '👤', color: '#888' };
    const { emoji, color } = avatar;

    return (
        <div style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.6}px`,
            position: 'relative',
            userSelect: 'none',
            border: isSelf ? '2px solid var(--primary-color)' : 'none'
        }}>
            {emoji}
            {showStatus && user?.lastActive && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: `${size * 0.25}px`,
                    height: `${size * 0.25}px`,
                    backgroundColor: 'var(--active-color)', // You might want to pass status color properly
                    borderRadius: '50%',
                    border: '2px solid var(--sidebar-bg)'
                }} />
            )}
        </div>
    );
};

export default UserAvatar;
