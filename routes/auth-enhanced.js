const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmailService = require('../utils/emailService');
const crypto = require('crypto');

// Gjenero token verifikimi
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// ✅ REGJISTRIM I RI ME VERIFIKIM EMAIL
router.post('/register-with-verification', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validimi i të dhënave
        if (!username || !password || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ju lutem plotësoni të gjitha fushat' 
            });
        }

        // Kontrollo nëse ekziston përdoruesi
        const userExists = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Përdoruesi ose email-i ekziston tashmë' 
            });
        }

        // Hash password-in
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Gjenero token verifikimi
        const verificationToken = generateVerificationToken();
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 orë

        // Krijo përdoruesin e paverifikuar
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (username, password, email, verification_token, verification_token_expires, is_verified) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [username, hashedPassword, email, verificationToken, verificationTokenExpires, false],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });

        // Dërgo email verifikimi
        const emailSent = await EmailService.sendVerificationEmail(email, verificationToken);

        if (emailSent) {
            res.json({ 
                success: true, 
                message: 'Regjistrimi u krye! Kontrollo email-in për linkun e verifikimit.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Regjistrimi u krye, por dërgimi i email-it dështoi. Kontakto support.' 
            });
        }

    } catch (error) {
        console.error('Gabim në regjistrim:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

// ✅ VERIFIKIM I EMAIL-IT
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send('Token i pavlefshëm');
        }

        // Gjej përdoruesin me token-in
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires > ?',
                [token, new Date()],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(400).send('Token i pavlefshëm ose i skaduar');
        }

        // Verifiko përdoruesin
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
                [user.id],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        // Redirect në faqen e suksesit
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email i Verifikuar - ChatAI ALBA</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                    .container { background: white; color: #333; padding: 40px; border-radius: 10px; margin: 0 auto; max-width: 500px; }
                    .success { color: #28a745; font-size: 48px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success">✅</div>
                    <h1>Email-i u Verifikua me Sukses!</h1>
                    <p>Llogaria juaj është aktivizuar. Tani mund të hyni në ChatAI ALBA.</p>
                    <a href="/" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
                        Shko në Faqen Kryesore
                    </a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Gabim në verifikim:', error);
        res.status(500).send('Gabim në verifikimin e email-it');
    }
});

// ✅ LOGIN I MODIFIKUAR (kërkon verifikim)
router.post('/login-with-verification', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Gjej përdoruesin
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Përdoruesi ose fjalëkalimi është i gabuar' 
            });
        }

        // Kontrollo nëse email-i është i verifikuar
        if (!user.is_verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email-i nuk është verifikuar. Kontrollo email-in për linkun e verifikimit.' 
            });
        }

        // Kontrollo fjalëkalimin
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Përdoruesi ose fjalëkalimi është i gabuar' 
            });
        }

        // Krijo JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Hyrja u krye me sukses!',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Gabim në login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

// ✅ RIDËRGIM I EMAIL-IT TË VERIFIKIMIT
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email-i nuk u gjet' 
            });
        }

        if (user.is_verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email-i është tashmë i verifikuar' 
            });
        }

        // Gjenero token të ri
        const newVerificationToken = generateVerificationToken();
        const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Përditëso token-in në databazë
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
                [newVerificationToken, newExpires, user.id],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        // Dërgo email-in e ri
        const emailSent = await EmailService.sendVerificationEmail(email, newVerificationToken);

        if (emailSent) {
            res.json({ 
                success: true, 
                message: 'Email-i i verifikimit u dërgua përsëri!' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Dërgimi i email-it dështoi. Provo përsëri më vonë.' 
            });
        }

    } catch (error) {
        console.error('Gabim në ridërgim:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim i brendshëm i serverit' 
        });
    }
});

module.exports = router;
