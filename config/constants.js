// ==================== ✅ APPLICATION CONSTANTS - 07.10.2024 ====================
// 📝 DESKRIMI: Konstantet e aplikacionit për menaxhim të centralizuar
// 🎯 QËLLIMI: Qendërzim i të gjitha konstantave në një vend
// 🔧 AUTORI: ChatAI ALBA Team
// ==============================================================================

module.exports = {
    // ✅ HTTP STATUS CODES
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_ERROR: 500
    },

    // ✅ ERROR MESSAGES
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: '❌ Kredencialet janë të pasakta',
        USER_NOT_FOUND: '❌ Përdoruesi nuk u gjet',
        EMAIL_ALREADY_EXISTS: '❌ Ky email ekziston tashmë',
        INVALID_TOKEN: '❌ Token i pavlefshëm'
    },

    // ✅ SUCCESS MESSAGES
    SUCCESS_MESSAGES: {
        REGISTER_SUCCESS: '✅ Përdoruesi u regjistrua me sukses',
        LOGIN_SUCCESS: '✅ Identifikimi u krye me sukses',
        EMAIL_SENT: '✅ Email-i u dërgua me sukses'
    }
};
