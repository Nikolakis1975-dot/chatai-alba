// ==================== ✅ AUTH MIDDLEWARE - 07.10.2024 ====================
// 📝 DESKRIMI: Middleware për verifikimin e JWT token
// 🎯 QËLLIMI: Mbrojtja e routes me authentication
// 🔧 AUTORI: ChatAI ALBA Team
// =========================================================================

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        // ✅ MARJA E TOKEN-IT NGA COOKIE (sistemi ekzistues)
        const token = req.cookies.auth_token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: '❌ Nuk jeni i identifikuar'
            });
        }

        // ✅ VERIFIKIMI I TOKEN-IT (përdor secret ekzistues)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_2024');
        
        // ✅ VENDOSJA E USER DATA NË REQUEST
        req.user = decoded;
        next();

    } catch (error) {
        console.error('❌ Gabim në authentication:', error);
        return res.status(401).json({
            success: false,
            message: '❌ Session i pavlefshëm'
        });
    }
};

module.exports = { authenticateToken };
