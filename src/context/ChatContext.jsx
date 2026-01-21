import React, { createContext, useContext, useEffect, useState } from 'react';
import { formatISO, subHours } from 'date-fns';

const ChatContext = createContext();

const DB_KEY = 'kominukator_db';
const SESSION_KEY = 'kominukator_session';

const getUseLocalStorage = () => {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : { users: [], messages: [] };
};

const saveToLocalStorage = (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    // Dispatch event for other tabs
    window.dispatchEvent(new Event('storage'));
};

// Initial simulated data if empty
const initializeDB = () => {
    const db = getUseLocalStorage();
    if (db.users.length === 0) {
        db.users = [
            { id: 'u1', nickname: 'Alice', avatar: { emoji: '👩', color: '#E91E63' }, lastActive: formatISO(new Date()) },
            { id: 'u2', nickname: 'Bob', avatar: { emoji: '👨', color: '#2196F3' }, lastActive: formatISO(subHours(new Date(), 2)) }, // Active 2h ago
        ];
        saveToLocalStorage(db);
    }
};

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [db, setDb] = useState({ users: [], messages: [] });
    const [activeChat, setActiveChat] = useState(null); // null = Global, 'userId' = Private

    // Initialize
    useEffect(() => {
        initializeDB();
        setDb(getUseLocalStorage());

        // Restore session
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session) {
            setUser(JSON.parse(session));
        }

        const handleStorageChange = () => {
            setDb(getUseLocalStorage());
        };

        window.addEventListener('storage', handleStorageChange);
        // Polling loop to simulate "real-time" if storage event is flaky in some envs
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Heartbeat for active status
    useEffect(() => {
        if (!user) return;

        const heartbeat = setInterval(() => {
            const currentDb = getUseLocalStorage();
            const userIndex = currentDb.users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                currentDb.users[userIndex].lastActive = formatISO(new Date());
                saveToLocalStorage(currentDb);
            }
        }, 10000); // Every 10 seconds

        return () => clearInterval(heartbeat);
    }, [user]);

    const login = (nickname, avatar = { emoji: '👤', color: '#888' }) => {
        const newUser = { id: Date.now().toString(), nickname, avatar, lastActive: formatISO(new Date()) };
        const currentDb = getUseLocalStorage();

        // Check if user exists (simple logic for demo)
        const existing = currentDb.users.find(u => u.nickname === nickname);
        if (existing) {
            // "Log in" as existing
            existing.avatar = avatar; // Update avatar on login just in case they changed it (optional, but good for testing)
            setUser(existing);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(existing));

            // Update status immediately
            existing.lastActive = formatISO(new Date());
            const idx = currentDb.users.findIndex(u => u.id === existing.id);
            currentDb.users[idx] = existing;
            saveToLocalStorage(currentDb);
        } else {
            // Register new
            currentDb.users.push(newUser);
            saveToLocalStorage(currentDb);
            setUser(newUser);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        }
    };

    const logout = () => {
        setUser(null);
        setActiveChat(null);
        sessionStorage.removeItem(SESSION_KEY);
    };

    const sendMessage = (text, replyToId = null, attachment = null) => {
        if (!user) return;
        const newMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            recipientId: activeChat, // Add recipient
            text,
            replyToId,
            attachment,
            timestamp: formatISO(new Date()),
            status: 'sent'
        };
        const currentDb = getUseLocalStorage();
        currentDb.messages.push(newMessage);
        saveToLocalStorage(currentDb);
    };

    const deleteMessage = (msgId) => {
        const currentDb = getUseLocalStorage();
        const msgIndex = currentDb.messages.findIndex(m => m.id === msgId);
        if (msgIndex !== -1 && currentDb.messages[msgIndex].senderId === user?.id) {
            currentDb.messages.splice(msgIndex, 1);
            saveToLocalStorage(currentDb);
        }
    };

    return (
        <ChatContext.Provider value={{
            user,
            users: db.users,
            messages: db.messages,
            activeChat,
            selectChat: setActiveChat,
            login,
            logout,
            sendMessage,
            deleteMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
