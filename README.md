# VIRALFORGE AI — Creative Operating System

A distinctive, dark-violet, responsive **full-stack SaaS portfolio project**, built with Next.js App Router, React, TypeScript, Tailwind CSS v4, MongoDB/Mongoose, JWT sessions and an optional OpenAI integration.

> **Scope honesty:** The app supports content **planning** and manual status tracking. It does not post to social networks or retrieve their real performance metrics. The Analytics tab visualizes records stored in MongoDB. AI Studio works in **template mode** without an API key and in **AI mode** with a valid OpenAI key. No paid integration is needed to explore the workflow.

## 1. Requirements

- Node.js **20.9+** (Node 22 or 24 recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Optional OpenAI API key

## 2. Get started on Ubuntu

```bash
# From the unzipped project folder
cd viralforge-ai
npm install
cp .env.example .env.local
```

Create a strong secret:

```bash
openssl rand -base64 48
```

Open `.env.local` and set:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/viralforge_ai
SESSION_SECRET=PASTE_YOUR_GENERATED_SECRET_HERE
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

For local MongoDB, you can start the service with:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

If you use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Never commit `.env.local` to GitHub.

Start development:

```bash
npm run dev
```

Open **http://localhost:3000**. Create an account on **/signup**; the application creates your first brand workspace automatically.

> If port 3000 is taken, run `npm run dev -- -p 3001` and open `http://localhost:3001`.

## 3. Pages and working flows

| Route | Features |
|---|---|
| `/` | High-impact marketing landing page with embedded dashboard showcase |
| `/signup`, `/login` | Registration, password hashing, signed HTTP-only session cookies |
| `/dashboard` | Real brand-based content counts, creation trend chart, upcoming posts |
| `/content` | Search, filters, create/edit/delete posts, captions, tags, statuses |
| `/calendar` | Month view, select dates, schedule / edit content |
| `/studio` | API-backed AI drafts or no-key starter templates; save results |
| `/analytics` | Honest first-party content counts, platform breakdown and progress |
| `/brands` | Create, switch, edit and delete independent brand workspaces |
| `/settings` | Edit current workspace name/voice and view account details |

### User flow to test
1. Create an account.
2. Add a second brand in **Brand workspaces**, then switch between brands.
3. Add a post, edit its status to **Scheduled**, and give it a planned date.
4. Find the post in the **Content calendar**.
5. Generate a draft in **AI Studio** (it will use template mode until you set your API key).
6. Click **Save as draft** and edit it in the **Content library**.
7. View truthful counts in the **Dashboard** and **Analytics** pages.
8. Sign out and sign in again to verify persistence.

## 4. Project structure

```text
src/
  app/
    (auth)/                     login / signup
    (platform)/                 protected product pages
    api/                        REST-style authenticated routes
    globals.css                 design system + responsive styling
    page.tsx                    marketing homepage
  components/                   interactive cards, editor, navigation
  lib/                          auth, validation, MongoDB, fetch helpers
  models/                       User, Workspace, Post Mongoose schemas
```

## 5. Main features demonstrated to international recruiters

- Professional responsive product UI, not an isolated visual mockup
- Reusable components, multiple interactive product pages, accessible controls
- Password hashing, session verification, protected pages and owner-scoped queries
- Client/server data flow, JSON APIs, validation with Zod, safe errors
- Mongoose schema design and basic relation isolation
- Third-party AI API integration with keys kept **only on the server**
- Charts from actual application records, no invented social performance data
- Mobile navigation, loaders, confirmation flows, toast feedback, empty states

## 6. Useful commands

```bash
npm run dev
npm run check:source
npm run typecheck
npm run lint
npm run build
npm run start
```

## 7. Deployment

1. Push the source to a GitHub repository.
2. Create a MongoDB Atlas database, restrict database credentials and add a database user.
3. Import the repository into Vercel.
4. In Vercel Environment Variables, add `MONGODB_URI` and `SESSION_SECRET`. Add `OPENAI_API_KEY` only if you want real AI calls.
5. Deploy, then test signup/login, creating/scheduling posts and switching workspaces in the live app.

**Before production use with external customers:** implement signup/login throttling, CSRF protection as applicable, email verification, password resets, stricter abuse monitoring, audit logs, stronger deployment/database hardening and automated integration tests. This is a portfolio-ready MVP, not a security-audited commercial service.

## 8. Portfolio case-study idea

**Problem:** Creative teams switch between spreadsheets, idea documents and disparate planning tools.

**Solution:** One cohesive SaaS for drafting, organizing, scheduling (for planning only), and understanding content workflow.

**My responsibilities:** UI design system, responsive frontend, API architecture, database schema, auth, form validation, charts, AI integration, deployment.

**Tradeoff:** Chose manual status tracking and truthful internal analytics rather than pretending third-party auto-publishing or social reach data exists.

**Next milestones:** automated tests, team permissions, OAuth, integrations, real social platform APIs subject to approvals, keyboard shortcuts and accessibility audits.

## Visual guide

Open **`UI_PREVIEW.html`** directly in your browser for a static *design-only* showcase if you want to inspect the color palette before running the Next.js application. It does not have working backend features.

## Validation status of this ZIP

The source was checked for TypeScript/TSX syntax and valid local imports in the authoring environment. A full `npm install`, `npm run build`, and browser-based runtime test could **not** be performed in the authoring environment because access to the npm registry was unavailable. After extracting, install dependencies and run the typecheck/build steps above on your own machine.
