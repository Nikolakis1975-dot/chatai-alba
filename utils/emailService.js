const nodemailer = require('nodemailer');

class EmailService {
    static transporter = null;
    static useDirectAPI = false;

    // ✅ INICIALIZO TRANSPORTER-IN ME DETEKTIM AUTOMATIK
    static initializeTransporter() {
        if (this.transporter) return;

        try {
            console.log('🔧 Konfigurimi i Email Service:');
            console.log('   📧 Host:', process.env.SMTP_HOST);
            console.log('   🚪 Port:', process.env.SMTP_PORT);
            console.log('   👤 User:', process.env.SMTP_USER);
            console.log('   🔐 Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'MUNGON');

            // ✅ DETEKTO NËSE PËRDORIM RESEND.COM
            if (process.env.SMTP_HOST === 'smtp.resend.com') {
                console.log('   🎯 Përdor Resend.com SMTP');
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.resend.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'resend',
                        pass: process.env.SMTP_PASS
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }
            // ✅ DETEKTO NËSE PËRDORIM SENDGRID
            else if (process.env.SMTP_HOST === 'smtp.sendgrid.net') {
                console.log('   🎯 Përdor SendGrid SMTP');
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SMTP_PASS
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }
            // ✅ PROVIDER TJETËR
            else {
                console.log('   🎯 Përdor provider të personalizuar');
                this.transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }

            console.log('✅ Transporter i email-it u inicializua');

        } catch (error) {
            console.error('❌ Gabim në inicializimin e transporter-it:', error);
        }
    }

    // ✅ VERIFIKO KONFIGURIMIN E EMAIL-IT
    static async verifyConfiguration() {
        if (!this.transporter) {
            this.initializeTransporter();
        }

        if (!process.env.SMTP_PASS) {
            console.error('❌ SMTP_PASS nuk është konfiguruar!');
            return false;
        }

        try {
            console.log('🔄 Duke verifikuar konfigurimin e serverit të email-it...');
            await this.transporter.verify();
            console.log('✅ Serveri i email-it është gati për dërgim mesazhesh');
            return true;
        } catch (error) {
            console.error('❌ GABIM NË VERIFIKIMIN E SERVERIT TË EMAIL-IT:');
            console.error('   💡 Problem:', error.message);
            
            // ✅ PROVO DIRECT API NËSE SMTP DËSHTO
            if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
                console.log('   🔄 SMTP dështoi, duke provuar API direkt...');
                return await this.tryDirectAPI();
            }
            
            return false;
        }
    }

    // ✅ PROVO DIRECT API PËR SENDGRID OSE RESEND
    static async tryDirectAPI() {
        try {
            // ✅ PROVO SENDGRID API
            if (process.env.SMTP_PASS.startsWith('SG.')) {
                console.log('   🎯 Duke provuar SendGrid API direkt...');
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SMTP_PASS);
                
                // Test me një email të vogël
                await sgMail.send({
                    to: 'test@example.com',
                    from: 'noreply@chatai-alba.com',
                    subject: 'Test',
                    text: 'Test'
                });
                
                console.log('✅ SendGrid API funksionon!');
                this.useDirectAPI = true;
                return true;
            }
            // ✅ PROVO RESEND API
            else if (process.env.SMTP_PASS.startsWith('re_')) {
                console.log('   🎯 Duke provuar Resend API direkt...');
                // Resend nuk ka nevojë për test paraprak
                console.log('✅ Resend API gati!');
                this.useDirectAPI = true;
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('   ❌ Direct API dështoi:', error.message);
            return false;
        }
    }

    // ✅ DËRGO EMAIL VERIFIKIMI ME MBËSHTETJE PËR TË GJITHA METODAT
    static async sendVerificationEmail(userEmail, verificationToken) {
        try {
            console.log(`📧 Duke dërguar email verifikimi për: ${userEmail}`);

            const verificationLink = `${process.env.SITE_URL || 'https://chatai-alba.onrender.com'}/api/email/verify-email?token=${verificationToken}`;
            
            // ✅ PROVO SMTP SË PARI
            const smtpConfigured = await this.verifyConfiguration();
            
            if (smtpConfigured && !this.useDirectAPI) {
                return await this.sendViaSMTP(userEmail, verificationToken, verificationLink);
            }
            // ✅ PROVO DIRECT API
            else if (this.useDirectAPI) {
                return await this.sendViaDirectAPI(userEmail, verificationToken, verificationLink);
            }
            // ✅ FALLBACK NË CONSOLE
            else {
                throw new Error('Asnjë metodë e email-it nuk funksionon');
            }

        } catch (error) {
            console.error('❌ GABIM NË DËRGIMIN E EMAIL-IT:', error.message);
            return this.fallbackToConsole(userEmail, verificationToken);
        }
    }

    // ✅ DËRGO EMAIL PËRMES SMTP
    static async sendViaSMTP(userEmail, verificationToken, verificationLink) {
        const emailTemplate = this.generateEmailTemplate(verificationLink);
        
        const mailOptions = {
            from: `"ChatAI ALBA" <noreply@chatai-alba.com>`,
            to: userEmail,
            subject: '📧 Verifikoni Email-in tuaj - ChatAI ALBA',
            html: emailTemplate,
            text: `Përshëndetje!\n\nFaleminderit që u regjistruat në ChatAI ALBA. Për të verifikuar email-in tuaj, ju lutem përdorni këtë link:\n\n${verificationLink}\n\nKy link do të skadojë pas 24 orësh.\n\nMe respekt,\nEkipi i ChatAI ALBA`
        };

        const result = await this.transporter.sendMail(mailOptions);
        
        console.log('✅ EMAIL I DËRGUAR ME SUKSES (SMTP):');
        console.log(`   📨 Për: ${userEmail}`);
        console.log(`   🆔 Message ID: ${result.messageId}`);
        
        return true;
    }

    // ✅ DËRGO EMAIL PËRMES DIRECT API
    static async sendViaDirectAPI(userEmail, verificationToken, verificationLink) {
        const emailTemplate = this.generateEmailTemplate(verificationLink);
        
        // ✅ SENDGRID API
        if (process.env.SMTP_PASS.startsWith('SG.')) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SMTP_PASS);
            
            const msg = {
                to: userEmail,
                from: 'noreply@chatai-alba.com',
                subject: '📧 Verifikoni Email-in tuaj - ChatAI ALBA',
                html: emailTemplate,
                text: `Përshëndetje!\n\nFaleminderit që u regjistruat në ChatAI ALBA. Për të verifikuar email-in tuaj, ju lutem përdorni këtë link:\n\n${verificationLink}`
            };
            
            await sgMail.send(msg);
            console.log('✅ EMAIL I DËRGUAR ME SUKSES (SendGrid API)');
        }
        // ✅ RESEND API
        else if (process.env.SMTP_PASS.startsWith('re_')) {
            const { Resend } = require('resend');
            const resend = new Resend(process.env.SMTP_PASS);
            
            await resend.emails.send({
                from: 'ChatAI ALBA <noreply@chatai-alba.com>',
                to: userEmail,
                subject: '📧 Verifikoni Email-in tuaj - ChatAI ALBA',
                html: emailTemplate,
            });
            
            console.log('✅ EMAIL I DËRGUAR ME SUKSES (Resend API)');
        }
        
        console.log(`   📨 Për: ${userEmail}`);
        return true;
    }

    // ✅ TEMPLATE I EMAIL-IT
    static generateEmailTemplate(verificationLink) {
        return `
<!DOCTYPE html>
<html lang="sq">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikoni Email-in - ChatAI ALBA</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { background: #667eea; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #2d3748; color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 ChatAI ALBA</h1>
            <p>Verifikoni Email-in tuaj</p>
        </div>
        <div class="content">
            <p>Përshëndetje!</p>
            <p>Faleminderit që u regjistruat në <strong>ChatAI ALBA</strong>. Për të aktivizuar llogarinë tuaj, ju lutem klikoni butonin më poshtë:</p>
            
            <div style="text-align: center;">
                <a href="${verificationLink}" class="button">✅ Verifiko Email-in</a>
            </div>
            
            <p>Ose kopjojeni këtë link në shfletuesin tuaj:</p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all;">
                ${verificationLink}
            </p>
            
            <p><strong>Ky link do të skadojë pas 24 orësh.</strong></p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ChatAI ALBA. Të gjitha të drejtat e rezervuara.</p>
        </div>
    </div>
</body>
</html>`;
    }

    // ✅ FALLBACK NË CONSOLE
    static fallbackToConsole(userEmail, verificationToken) {
        const verificationLink = `${process.env.SITE_URL || 'https://chatai-alba.onrender.com'}/api/email/verify-email?token=${verificationToken}`;
        
        console.log('\n📧 ===== EMAIL VERIFIKIMI (FALLBACK MODE) =====');
        console.log(`📨 Për: ${userEmail}`);
        console.log(`🔗 Linku i verifikimit: ${verificationLink}`);
        console.log(`🔐 Token: ${verificationToken}`);
        console.log('💡 KOPJOJE KËTË LINK NË SHFRETUES PËR VERIFIKIM!');
        console.log('📧 ========================================\n');
        
        return false;
    }
}

// ✅ INICIALIZO AUTOMATIKISHT
EmailService.initializeTransporter();

module.exports = EmailService;
