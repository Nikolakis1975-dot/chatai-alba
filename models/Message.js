// models/Message.js
class Message {
    constructor(userId, content, type = 'user') {
        this.id = this.generateId();
        this.userId = userId;
        this.content = content;
        this.type = type; // 'user' ose 'bot'
        this.timestamp = new Date();
        this.conversationId = this.generateConversationId();
    }

    generateId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateConversationId() {
        return 'conv_' + this.userId + '_' + new Date().toISOString().split('T')[0];
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            content: this.content,
            type: this.type,
            timestamp: this.timestamp,
            conversationId: this.conversationId
        };
    }
}

module.exports = Message;
