// ==================== ✅ USER MODEL - VERSION I KORRIGJUAR ====================
// 📝 DESKRIMI: Modeli i përdoruesit për databazën
// 🎯 QËLLIMI: Menaxhim i të dhënave të përdoruesve  
// 🔧 AUTORI: ChatAI ALBA Team
// ====================================================================

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geminiApiKey: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        openaiApiKey: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isOpenaiActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        profilePicture: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['username']
            },
            {
                fields: ['email']
            }
        ]
    });

    // ✅ METODA INSTANCE
    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.password;  // Mos e kthe password në response
        delete values.geminiApiKey;  // Mos e kthe API Key
        delete values.openaiApiKey;  // Mos e kthe API Key
        return values;
    };

    // ✅ METODA STATIKE
    User.findByUsername = function(username) {
        return this.findOne({ where: { username } });
    };

    User.findByEmail = function(email) {
        return this.findOne({ where: { email } });
    };

    return User;
};
