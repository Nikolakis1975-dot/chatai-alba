const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ Përditëso foton e profilit - VERSION I RIPARUAR
router.post('/profile-picture', (req, res) => {
    try {
        // ✅ MERRE USER ID NGA SESIONI (SË PARMI!)
        const userId = req.userId || req.body.userId;
        const { profile_picture } = req.body;

        console.log('📸 UPDATE FOTO PROFIL:', { userId, hasPhoto: !!profile_picture });

        if (!userId) {
            return res.json({
                success: false,
                message: '❌ Sesioni nuk u gjet. Rifresko faqen.'
            });
        }

        if (!profile_picture) {
            return res.json({
                success: false, 
                message: '❌ Fotoja nuk u dërgua'
            });
        }

        db.run(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [profile_picture, userId],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në update foto:', err);
                    return res.json({
                        success: false,
                        message: '❌ Gabim gjatë përditësimit të fotos'
                    });
                }

                console.log('✅ Foto u përditësua:', this.changes);

                res.json({
                    success: true,
                    message: '✅ Fotoja e profilit u përditësua me sukses!'
                });
            }
        );

    } catch (error) {
        console.error('❌ Gabim në profile-picture:', error);
        res.json({
            success: false,
            message: '❌ Gabim në përditësimin e fotos'
        });
    }
});

// ✅ Merr foton e profilit - VERSION I RIPARUAR
router.get('/profile-picture/:userId?', (req, res) => {
    try {
        // ✅ MERRE USER ID NGA PARAMETER OSE SESIONI
        const userId = req.params.userId || req.userId;

        console.log('📸 GET FOTO PROFIL:', { userId });

        if (!userId) {
            return res.json({
                success: false,
                message: '❌ User ID nuk u gjet'
            });
        }

        db.get(
            'SELECT profile_picture FROM users WHERE id = ?',
            [userId],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në marrjen e fotos:', err);
                    return res.json({
                        success: false,
                        message: '❌ Gabim gjatë marrjes së fotos'
                    });
                }

                if (row && row.profile_picture) {
                    res.json({
                        success: true,
                        profile_picture: row.profile_picture
                    });
                } else {
                    res.json({
                        success: true,
                        profile_picture: null,
                        message: '👤 Nuk ka foto profili'
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim në profile-picture GET:', error);
        res.json({
            success: false,
            message: '❌ Gabim në marrjen e fotos'
        });
    }
});

// ✅ RUTA E RE: KRIJO/KONTROLLO USER NËSE NUK EKZISTON
router.get('/check-user', (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: '❌ Sesioni nuk u gjet'
            });
        }

        db.get(
            'SELECT id, username, profile_picture FROM users WHERE id = ?',
            [userId],
            (err, user) => {
                if (err) {
                    console.error('❌ Gabim në check-user:', err);
                    return res.json({
                        success: false,
                        message: '❌ Gabim në kontrollimin e userit'
                    });
                }

                if (!user) {
                    // ✅ KRIJO USER TË RI NËSE NUK EKZISTON
                    db.run(
                        'INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)',
                        [userId, 'User-' + userId, new Date().toISOString()],
                        function(err) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    message: '❌ Gabim në krijimin e userit'
                                });
                            }

                            res.json({
                                success: true,
                                user: {
                                    id: userId,
                                    username: 'User-' + userId,
                                    profile_picture: null
                                },
                                message: '🆕 User i ri u krijua'
                            });
                        }
                    );
                } else {
                    res.json({
                        success: true,
                        user: user
                    });
                }
            }
        );

    } catch (error) {
        console.error('❌ Gabim në check-user:', error);
        res.json({
            success: false,
            message: '❌ Gabim në kontrollimin e userit'
        });
    }
});

module.exports = router;
