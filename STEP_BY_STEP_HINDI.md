# ViralForge AI — Step-by-step guide (Hinglish)

## Step 1 — ZIP extract karo
`viralforge-ai.zip` extract karo, folder VS Code mein open karo.

## Step 2 — Terminal commands
```bash
cd viralforge-ai
npm install
cp .env.example .env.local
```

## Step 3 — Database setup
Agar tumhare Ubuntu par MongoDB already installed hai:
```bash
sudo systemctl start mongod
```
Default MongoDB URI `.env.local` mein diya hai. Cloud database use karna ho toh Atlas URI paste karo.

## Step 4 — Login secret
```bash
openssl rand -base64 48
```
Jo output aayega usse `.env.local` ke `SESSION_SECRET` mein paste karo.

## Step 5 — Run
```bash
npm run dev
```
Browser mein `http://localhost:3000` open karo. Agar port busy ho: `npm run dev -- -p 3001`.

## Step 6 — App test karo
Signup > Dashboard > Brands > Content library > Calendar > AI Studio > Analytics.
AI key na ho toh generation **template mode** mein chalegi. Social posts automatic publish nahi hote; calendar sirf planning ke liye hai.

## Step 7 — Tumhara recruiter pitch
“Built a responsive, multi-workspace content planning SaaS using Next.js, TypeScript and MongoDB, with authenticated CRUD APIs, optional AI integration and first-party analytics.”

## Step 8 — GitHub and portfolio
Apna GitHub repo banao, project ke proper screenshots add karo, README include karo, Vercel + MongoDB Atlas se deploy karo, aur apne developer portfolio ke Featured Project mein live link + source link show karo.

## Step 9 — Next improvement
Is project par first PR as a showcase: add Playwright E2E tests, protected API test cases, optimistic UI states and keyboard shortcuts.
