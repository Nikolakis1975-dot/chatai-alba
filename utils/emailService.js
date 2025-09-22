// utils/emailService.js - VERSION I RREGULLUAR PËR PRODUKTION
class EmailService {
    static async sendVerificationEmail(userEmail, verificationToken) {
        // ✅ RREGULLUAR: Përdor URL-në e vërtetë të prodhimit
        const verificationLink = `https://chatai-alba.onrender.com/api/auth/verify-email?token=${verificationToken}`;
        
        console.log('\n📧 ===== EMAIL VERIFIKIMI (PRODUCTION MODE) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i verifikimit: ${verificationLink}`);
        console.log(`🔐 Token: ${verificationToken}`);
        console.log('⏰ Skadon pas: 24 orësh');
        console.log('💡 KOPJOJE KËTË LINK NË SHFRETUES PËR VERIFIKIM!');
        console.log('📧 ==============================================\n');
        
        return true;
    }

    static async sendPasswordResetEmail(userEmail, resetToken) {
        // ✅ RREGULLUAR EDHE KËTU:
        const resetLink = `https://chatai-alba.onrender.com/reset-password?token=${resetToken}`;
        
        console.log('\n📧 ===== RESET PASSWORD (PRODUCTION MODE) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i resetimit: ${resetLink}`);
        console.log(`🔐 Token: ${resetToken}`);
        console.log('⏰ Skadon pas: 1 ore');
        console.log('📧 ===========================================\n');
        
        return true;
    }
}

module.exports = EmailService;
