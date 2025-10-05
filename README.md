# 🤖 ChatAI ALBA - Platforma Intelligjente Shqip

<div align="center">

![ChatAI ALBA](https://img.shields.io/badge/ChatAI-ALBA-blue?style=for-the-badge&logo=ai&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=for-the-badge&logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3.x-blue?style=for-the-badge&logo=sqlite)

**Platforma më e avancuar e bisedave inteligjente në gjuhën shqipe**

[Funksionalitetet](#-funksionalitetet) • [Instalimi](#-instalimi) • [API](#-api-documentation) • [Struktura](#-struktura-e-projektit)

</div>

## 🌟 Përshkrim

**ChatAI ALBA** është një platformë e avancuar e bisedave inteligjente që integron Google Gemini AI me një sistem të plotë të menaxhimit të përdoruesve, verifikimit të email-it dhe ruajtjes së historisë së bisedave.

### 🎯 Qëllimi
- 🤖 Ofroni një asistent inteligjent në gjuhën shqipe
- 🔐 Siguroni autentikim të sigurt me verifikim email-i
- 💾 Ruani historinë e bisedave në mënyrë të sigurt
- 🚀 Ofroni API të dokumentuar për zhvilluesit

---

## ✨ Funksionalitetet

### 🤖 Bisedë Inteligjente
- **Gemini AI Integration** - Bisedë natyrale me Google Gemini 2.0 Flash
- **Multi-language Support** - Mbështetje për shqip dhe anglisht
- **Context Awareness** - Mbajtje e kontekstit të bisedës
- **Code Highlighting** - Theksim sintakse për kod programimi

### 🔐 Sistem Sigurie
- **HTTP-only Cookies** - Autentikim i sigurt
- **Email Verification** - Verifikim me link të dërguar me email
- **API Key Encryption** - Ruajtje e sigurt e çelësave të API
- **Rate Limiting** - Parandalim abuzimi

### 👤 Menaxhim Përdoruesish
- **Regjistrim & Login** - Sistem i plotë autentikimi
- **Profile Management** - Ngarkim foto profili
- **Session Management** - Menaxhim sesionesh të sigurta
- **Password Security** - Fjalëkalime të hash-uara

### 💾 Ruajtje e të Dhënave
- **SQLite Database** - Database e shpejtë dhe e besueshme
- **Chat History** - Ruajtje e plotë e historisë së bisedave
- **Message Encryption** - Enkriptim AES-256 për të dhëna sensitive
- **Backup & Export** - Eksport i historisë në JSON

### 🔧 Vegla shtesë
- **Wikipedia Search** - Kërkime direkt në Wikipedia
- **Translation Service** - Përkthime në kohë reale
- **Weather Info** - Informacion moti për qytete
- **Calculator** - Llogaritje matematikore

---

## 🛠️ Instalimi

### Parakushtet
- **Node.js** 18.x ose më lartë
- **npm** ose **yarn**
- **Git**

### Hapat e Instalimit

```bash
# 1. Klono repository-n
git clone https://github.com/Nikolakis1975-dot/chatai-alba.git
cd chatai-alba

# 2. Instalo dependencat
npm install

# 3. Konfiguro variablat e mjedisit
cp .env.example .env
# Redakto .env skedarin me të dhënat e tua

# 4. Nis server-in
npm start

# Për zhvillim, përdor:
npm run dev

# Server Configuration
PORT=3000
NODE_ENV=production
JWT_SECRET=sekreti_juaj_shume_i_sigurt_ketu
ENCRYPTION_KEY=32_karaktere_encryption_key_ketu

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emaili_juaj@gmail.com
SMTP_PASS=fjalekalimi_i_app_ose_smtp

# Google Gemini API
GEMINI_API_KEY="API_KEY JOT NGJITE KETU"

# CORS & Security
CORS_ORIGIN=https://chatai-alba-gr9dw.ondigitalocean.app

🚀 Përdorimi
Hyrja në Sistem
Regjistrohu me email dhe fjalëkalim

Verifiko email-in me linkun e dërguar

Hyr në sistem me kredencialet e tua

Konfiguro API Key për Gemini (/apikey komanda)

Komandat e Chatbot-it
bash
/ndihmo                 # Shfaq të gjitha komandat
/apikey [key]          # Vendos API Key për Gemini
/moti [qyteti]         # Informacion moti
/wiki [kerkim]         # Kërkim në Wikipedia
/perkthim [gj] [tekst] # Përkthim tekstesh
/meso [pyetje]|[përgjigje] # Mëso përgjigje të reja
/dil                   # Dil nga sistemi
📡 API Documentation
Authentication Endpoints
http
POST /api/auth/register-with-email
POST /api/auth/login-with-verification  
GET  /api/auth/me
POST /api/auth/logout
Chat Endpoints
http
POST /api/gemini/ask
GET  /api/chat/history/:userId
POST /api/chat/save
DELETE /api/chat/clear/:userId
API Keys Management
http
POST /api/api-keys/save
GET  /api/api-keys/status/:serviceName
DELETE /api/api-keys/delete
Email Verification
http
POST /api/email/register-with-email
POST /api/email/resend-verification
GET  /api/email/verify-email?token=...
🏗️ Struktura e Projektit
text
chat-server/
├── 📂 controllers/          # Business logic
├── 📂 routes/               # API routes
├── 📂 middleware/           # Authentication & validation
├── 📂 services/             # External services (Gemini, Email)
├── 📂 models/               # Database models
├── 📂 utils/                # Helper functions
├── 📂 public/               # Frontend assets
└── 🚀 app.js               # Main application file
Teknologjitë e Përdorura
Backend: Node.js, Express.js

Database: SQLite3

Authentication: JWT + HTTP-only Cookies

Encryption: AES-256-CBC

Frontend: Vanilla JavaScript, HTML5, CSS3

AI: Google Gemini API

Email: Nodemailer + SMTP

🌐 Deployment
DigitalOcean App Platform
yaml
# app.yaml
name: chatai-alba
services:
- name: web
  source_dir: /
  github:
    repo: Nikolakis1975-dot/chatai-alba
    branch: main
  run_command: npm start
  environment_slug: node-js
Environment Variables në Production
bash
# CORS për domain-in tuaj
CORS_ORIGIN=https://chatai-alba-gr9dw.ondigitalocean.app

# Database path në production
DB_PATH=/tmp/chat.db
🤝 Kontribut
Ne mirëpresim kontributet! Ju lutem:

Fork repository-n

Krijo një branch të ri (git checkout -b feature/EmriIFeatures)

Commit ndryshimet tuaja (git commit -m 'Shto feature të re')

Push në branch (git push origin feature/EmriIFeatures)

Hap një Pull Request

📄 Licensa
Ky projekt është i licencuar nën licensën MIT - shiko skedarin LICENSE për detaje.

👨‍💻 Zhvilluesi
Nikolakis1975 - GitHub

🤝 Mirënjohje
Google Gemini AI për API-n e fuqishme të AI

DigitalOcean për platformën e shkëlqyer të deploy

Komuniteti Open Source për mjetet e shkëlqyera

📞 Kontakt
Nëse keni ndonjë pyetje ose sugjerim, mos hezitoni të:

📧 Dërgoni email: cimicimi1975@gmail.com

🐛 Raportoni bug: Issues

💡 Sugjeroni feature: Discussions

<div align="center">
⭐ Nëse ju pëlqen ky projekt, ju lutem jepni një star në GitHub!

"Për mua nuk ka të pamundur" - Filosofia jonë e zhvillimit 🚀

</div> ```
