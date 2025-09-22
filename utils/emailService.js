// utils/emailService.js - VERSION TESTUES (PA API KEY)
class EmailService {
    static async sendVerificationEmail(userEmail, verificationToken) {
        const verificationLink = `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
        
        console.log('\n📧 ===== EMAIL VERIFIKIMI (TEST MODE) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i verifikimit: ${verificationLink}`);
        console.log(`🔐 Token: ${verificationToken}`);
        console.log('⏰ Skadon pas: 24 orësh');
        console.log('💡 KOPJOJE KËTË LINK NË SHFRETUES PËR VERIFIKIM!');
        console.log('📧 ========================================\n');
        
        // Gjithmonë kthe sukses për testim (nuk dërgon email të vërtetë)
        return true;
    }

    static async sendPasswordResetEmail(userEmail, resetToken) {
        const resetLink = `${process.env.SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        console.log('\n📧 ===== RESET PASSWORD (TEST MODE) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i resetimit: ${resetLink}`);
        console.log(`🔐 Token: ${resetToken}`);
        console.log('⏰ Skadon pas: 1 ore');
        console.log('📧 =====================================\n');
        
        return true;
    }
}

module.exports = EmailService;
