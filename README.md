# Watch & Earn App

Users video dekhen, unke wallet mein reward add ho, aur wo withdrawal request bhejen
(JazzCash / EasyPaisa / Bank). Backend Node.js + Express + SQLite hai, frontend plain
HTML/CSS/JS hai (koi build step nahi chahiye).

## Setup (local)

```bash
cd backend
npm install
cp config/.env.example config/.env
# .env file kholen aur JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD set karen
npm start
```

Browser mein kholen: `http://localhost:4000`

Pehli baar server chalane par ek admin account automatically ban jata hai — email/password
`.env` mein set kiya hua use hoga. Us email/password se `/login.html` par login karen, phir
`/admin.html` par redirect ho jayenge.

## Kaise kaam karta hai

1. **Signup/Login** — JWT token localStorage mein store hota hai.
2. **Video watch** — Dashboard par videos list hoti hain. Video kholne par YouTube player
   chalta hai aur har 15 second baad backend ko "kitna watch kiya" bataya jata hai.
   Server-side pace check hai taake koi fake progress na bhej sake.
3. **Reward** — Jab video ka 80%+ (config mein `MIN_WATCH_PERCENT`) watch ho jaye, reward
   wallet mein credit ho jata hai. Roz ka maximum videos count `MAX_VIDEOS_PER_DAY` se
   control hota hai (abuse rokne ke liye).
4. **Withdrawal request** — User apna balance withdraw karne ki request bhejta hai
   (method + account number + name). Balance turant deduct ho jata hai (hold) aur request
   "pending" status mein admin panel mein chali jati hai.
5. **Admin approval** — Admin panel (`/admin.html`) mein pending requests dikhti hain.
   Abhi ye system **manual** hai: admin khud JazzCash/EasyPaisa app se paisa bhejta hai,
   phir "Paid Mark Karen" click karta hai. Reject karne par balance user ko wapis mil jata hai.

## IMPORTANT — Real payment gateway integrate karne se pehle

Real JazzCash/EasyPaisa/Bank API se **automatically** paisa bhejne ke liye ye cheezein
zaroori hain, jo koi bhi khud nahi bana sakta — inhe official channels se lena parta hai:

1. **Business registration** — kam se kam sole proprietorship (NTN FBR se), behtar hoga
   SECP se registered company.
2. **Merchant/Biller account** — JazzCash Business ya EasyPaisa se merchant agreement
   sign karna hoga. Wo aapko API credentials (Merchant ID, Integrity Salt, etc.) denge
   verification ke baad.
3. **Bank settlement account** — business ke naam par current account.
4. **Compliance** — SBP (State Bank of Pakistan) ke Payment Systems regulations follow
   karne honge agar aap ek platform ki tarah paisa move kar rahe hain.

Jab ye mil jayen, `backend/config/.env` mein credentials daal kar
`backend/routes/admin.js` ke `approve` endpoint mein (jahan `TODO` comment likha hai)
real API call add kar sakte hain.

## Zaroori: Business model ka reality check

Video ads se real revenue bohot chhoti hoti hai (fractions of a rupee per view).
Agar withdrawal ka paisa naye users ke "deposits" se aa raha hai (jo humne is
version mein include NAHI kiya kyunki aapne khud bola ke deposit nahi chahiye),
to wo legally Ponzi/pyramid scheme ban jata hai — Pakistan mein FIA aur SECP
aisi apps band kar chuke hain. Is version mein sirf earning-se-withdrawal flow
hai, jo safe model hai — lekin business sustainable tab hi hoga jab aapke paas
real ad revenue ka source ho (Google AdSense/AdMob, ya sponsors), taake jitna
users ko reward dete hain utna paisa kahin se aa bhi raha ho.

## Anti-fraud ke liye aage add karne layak cheezein (abhi basic hai)

- Email verification signup par
- Phone OTP verification withdrawal se pehle
- Rate limiting / CAPTCHA login-signup par
- Device/IP fingerprint check (multiple fake accounts rokne ke liye)
- Minimum account age before first withdrawal allowed ho

## Folder Structure

```
watch-earn-app/
  backend/
    routes/        -> auth, videos, wallet, withdraw, admin
    middleware/     -> JWT auth
    db.js           -> SQLite schema + default admin/videos
    server.js
  frontend/
    index.html, login.html, signup.html, dashboard.html, admin.html
    css/style.css
    js/app.js, js/youtube-tracker.js
```
