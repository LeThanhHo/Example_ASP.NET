import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBoxAI.css'; // File CSS tùy biến giao diện bên dưới

export default function ChatBoxAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Xin chào! Tôi có thể giúp gì cho bạn về hệ thống quản lý của bạn?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messageEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            // Gọi API trung gian từ C# Backend vừa viết ở bước trên
            const response = await axios.post('https://localhost:7116/api/ChatApi/send-message', {
                message: userMessage
            });

            setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Hệ thống AI đang bận, vui lòng thử lại sau!' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Nút Bong Bóng Tròn Mở Chat */}
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬 Trợ lý AI'}
            </button>

            {/* Cửa Sổ Khung Chat */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">Trợ Lý Ảo Đồ Án - AI</div>
                    <div className="chat-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="chat-bubble ai animate-pulse">AI đang suy nghĩ...</div>}
                        <div ref={messageEndRef} />
                    </div>
                    <form className="chat-footer" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi tại đây..."
                        />
                        <button type="submit" disabled={loading}>Gửi</button>
                    </form>
                </div>
            )}
        </div>
    );
}