// verification.js - VERSIONI I PLOTË I VERIFIKIMIT
console.log('✅ verification.js u ngarkua!');

// Funksioni kryesor i verifikimit
async function verifyEmail() {
    console.log('🎯 BUTONI I VERIFIKIMIT U KLIKUA!');
    
    try {
        // Merr token-in nga localStorage
        const token = localStorage.getItem('token');
        console.log('🔐 Token-i:', token ? 'EKZISTON' : 'NUK EKZISTON');
        
        if (!token) {
            alert('❌ Ju nuk jeni i loguar!');
            return;
        }

        // Merr të dhënat e përdoruesit
        const userResponse = await fetch('/api/auth/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!userResponse.ok) {
            alert('❌ Gabim në marrjen e të dhënave të përdoruesit');
            return;
        }

        const userData = await userResponse.json();
        console.log('👤 Përdoruesi:', userData);

        // Dërgo kërkesën për verifikim
        console.log('📧 Duke dërguar email verifikimi për:', userData.email);
        
        const response = await fetch('/api/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                email: userData.email
            })
        });

        const result = await response.json();
        console.log('📨 Përgjigja nga serveri:', result);

        if (result.success) {
            alert('✅ ' + result.message + '\n\nShiko konsolën e serverit për linkun e verifikimit!');
        } else {
            alert('❌ ' + result.message);
        }

    } catch (error) {
        console.error('❌ Gabim i papritur:', error);
        alert('❌ Gabim i papritur: ' + error.message);
    }
}

// Funksion për të kontrolluar statusin e verifikimit
async function checkVerificationStatus() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const userData = await response.json();
            const verifyBtn = document.getElementById('verify-email-btn');
            
            if (userData.is_verified && verifyBtn) {
                verifyBtn.style.display = 'none';
                console.log('✅ Përdoruesi është i verifikuar - butoni u fshi');
            }
        }
    } catch (error) {
        console.error('Gabim në kontrollimin e statusit:', error);
    }
}

// Inicializimi automatik
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 verification.js u inicializua!');
    
    // Kontrollo statusin e verifikimit çdo 5 sekonda
    setInterval(checkVerificationStatus, 5000);
    
    // Kontrollo menjëherë
    setTimeout(checkVerificationStatus, 1000);
});

// Event listener i sigurt për butonin
setInterval(() => {
    const btn = document.getElementById('verify-email-btn');
    if (btn && !btn.hasAttribute('data-verification-listener')) {
        btn.onclick = verifyEmail;
        btn.setAttribute('data-verification-listener', 'true');
        console.log('✅ Event listener u shtua në butonin e verifikimit!');
    }
}, 1000);
