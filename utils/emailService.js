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

    class EmailService {
    static async sendVerificationEmail(userEmail, verificationToken) {
        // ✅ PERDOR URL-NË E PRODUKTIONIT
        const verificationLink = `https://chatai-alba.onrender.com/api/auth/verify-email?token=${verificationToken}`;
        
        console.log('\n📧 ===== EMAIL VERIFIKIMI (PRODUCTION) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i verifikimit: ${verificationLink}`);
        console.log(`🔐 Token: ${verificationToken}`);
        console.log('💡 KOPJOJE KËTË LINK NË SHFRETUES!');
        console.log('📧 ========================================\n');
        
        return true;
    }
}

module.exports = EmailService;
