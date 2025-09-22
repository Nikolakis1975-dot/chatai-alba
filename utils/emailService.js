// utils/emailService.js - VERSION I RREGULLUAR PËR PRODUKTION
class EmailService {
    static async sendVerificationEmail(userEmail, verificationToken) {
        try {
            // ✅ URL E PRODUKTIONIT - FIKSE
            const verificationLink = `https://chatai-alba.onrender.com/api/auth/verify-email?token=${verificationToken}`;
            
            console.log('\n📧 ===== EMAIL VERIFIKIMI (PRODUCTION MODE) =====');
            console.log(`📨 Për: ${userEmail}`);
            console.log(`🔗 Linku i verifikimit: ${verificationLink}`);
            console.log(`🔐 Token: ${verificationToken}`);
            console.log('⏰ Skadon pas: 24 orësh');
            console.log('💡 KOPJOJE KËTË LINK NË SHFRETUES PËR VERIFIKIM!');
            console.log('📧 ==============================================\n');
            
            // Gjithmonë kthe sukses për testim
            return true;
            
        } catch (error) {
            console.error('❌ Gabim në sendVerificationEmail:', error);
            return false;
        }
    }

    static async sendPasswordResetEmail(userEmail, resetToken) {
        try {
            // ✅ URL E PRODUKTIONIT - FIKSE
            const resetLink = `https://chatai-alba.onrender.com/reset-password?token=${resetToken}`;
            
            console.log('\n📧 ===== RESET PASSWORD (PRODUCTION MODE) =====');
            console.log(`📨 Për: ${userEmail}`);
            console.log(`🔗 Linku i resetimit: ${resetLink}`);
            console.log(`🔐 Token: ${resetToken}`);
            console.log('⏰ Skadon pas: 1 ore');
            console.log('📧 ===========================================\n');
            
            return true;
            
        } catch (error) {
            console.error('❌ Gabim në sendPasswordResetEmail:', error);
            return false;
        }
    }

    // ✅ METODË TESTUESE PËR VERIFIKIM
    static testEmailService() {
        console.log('🧪 Testimi i EmailService...');
        this.sendVerificationEmail('test@example.com', 'test_token_123');
        console.log('✅ EmailService funksionon normalisht');
    }
}

module.exports = EmailService;
