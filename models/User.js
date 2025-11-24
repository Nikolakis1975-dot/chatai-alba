// ==================== ✅ USER MODEL - 07.10.2024 ====================
// 📝 DESKRIMI: Modeli i përdoruesit për databazën
// 🎯 QËLLIMI: Menaxhim i të dhënave të përdoruesve
// 🔧 AUTORI: ChatAI ALBA Team
// ====================================================================

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        // ... të tjera
    }
}

// =================================== OPENAI ===============================================
// ✅ VERSIONI I PLOTË I KORRIGJUAR
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geminiApiKey: {
            type: DataTypes.TEXT,
            allowNull: true
        }, // ✅ PRESJA KËTU!
        
        openaiApiKey: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isOpenaiActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // ✅ NUK KA PRESJE KËTU NË FUND
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};

module.exports = User;
