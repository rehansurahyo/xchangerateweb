You are the senior full-stack engineer for XchangeRate (Next.js 14 App Router + Supabase).

CRITICAL CONTEXT
- The database was reset. We must use ONLY these 6 tables in schema public:
  1) api_credentials
  2) billing
  3) profiles
  4) sessions_log
  5) settings
  6) trades_log
- NO new tables are allowed. If something is needed, store it in one of these (use json fields where possible: sessions_log.trades OR trades_log.logs).
- Use Supabase Auth users + public.profiles for user data.
- The UI already exists but currently shows dummy/static. Convert everything to real Supabase data.
- Production goal: stable, clean, no breaking changes, and confirm RLS policies.

DELIVERABLES BEFORE MEETING (must finish all)
A) Dashboard page fully dynamic
B) API Config page fully dynamic
C) Admin panel complete (data + actions + roles)
D) Community page frontend complete + design the “chat flow” architecture (without creating new DB tables)
E) Provide a short checklist + test plan for me to verify quickly

------------------------------------------------------------
PHASE 0 — DATABASE & POLICIES (DO THIS FIRST)
1) Confirm these tables exist exactly as listed:
   - api_credentials, billing, profiles, sessions_log, settings, trades_log
2) Add/verify basic RLS policies:
   - profiles:
       - user can read own profile
       - user can update own profile (safe fields)
       - admin can read all profiles
   - api_credentials:
       - user can read/update only their own records (match by email = auth.email OR profiles.email)
       - admin can read all
   - trades_log:
       - user can read only where email = auth.email
       - admin can read all
   - sessions_log:
       - user can read only where email = auth.email
       - admin can read all
   - billing:
       - public read allowed (plans visible)
       - only admin can write/update plans
   - settings:
       - everyone can read
       - only admin can update
3) Make sure auth.users triggers profile creation or handle profile creation in app after signup.

IMPORTANT: Do not rename tables again. No destructive changes.
------------------------------------------------------------

PHASE 1 — AUTH + USER CONTEXT
1) Implement a single utility to get current user session + profile:
   - getUser() from Supabase auth
   - getProfile(user.id) from profiles
2) Profile fields used:
   - profiles.is_admin controls admin access
   - profiles.billing_plan used for plan display
3) Block admin routes for non-admin. Redirect to /dashboard.

------------------------------------------------------------

PHASE 2 — API CONFIG PAGE (FULLY DYNAMIC)
Goal: A user can add/edit/remove API credentials and see status.

Use ONLY api_credentials table.

Tasks:
1) Replace dummy values with real CRUD:
   - List all api_credentials where email = currentUser.email
   - Create new credential record:
       fields:
       - email (current user email)
       - api_key, api_secret (store encrypted if encryption exists; if not, store raw for now but mark TODO)
       - target_percentage
       - status ("Active" / "Paused")
       - start_balance (optional)
       - start_time (set when status changes to Active)
       - ips and full_ips (arrays; if UI not collecting now, store [] and allow update later)
       - name default "Primary BTC"
       - exchange (Binance/Bybit/OKX)
       - threshold, portion_amount (default 0)
       - is_new default false
2) Edit credential:
   - allow updating target_percentage, status, exchange, name, threshold, portion_amount
   - if status becomes Active and start_time is null, set start_time = now
3) Delete credential:
   - add confirmation modal
   - only delete user’s own
4) Validation:
   - target_percentage 1..100
   - exchange required
   - api_key/api_secret required
5) UX:
   - show “Connected/Active/Paused” badge
   - show last sync info if available (if not in schema, show “—”)
6) Security:
   - never render full secret on UI; mask (show first 4 + last 4)
   - keep API Secret hidden by default

Acceptance Criteria:
- A user can create a credential and it appears instantly.
- Refresh page and data persists.
- Non-admin cannot see other users’ credentials.
- No new DB tables created.

------------------------------------------------------------

PHASE 3 — DASHBOARD PAGE (FULLY DYNAMIC)
Goal: show live account snapshots + trades logs using existing tables only.

Data sources allowed:
- trades_log = main trading metrics per symbol
- sessions_log = high-level session summary / last run payload in json (trades jsonb)
- settings = global bot config
- api_credentials = active sessions list

Tasks:
1) Build dashboard queries:
   - active sessions from api_credentials where email = currentUser.email
   - settings: load settings row (use first row; if missing, create one default row via admin only)
   - trades_log: show latest N logs for currentUser.email
   - sessions_log: show latest session entries for currentUser.email
2) Dashboard Widgets:
   - “Active Sessions Count” (# credentials with status=Active)
   - “Recent Trades” (trades_log latest 20)
   - “Latest Session Snapshot” (sessions_log latest 1; render trades json nicely if present)
   - “Bot Settings Summary” (read-only for user; admin can edit)
3) Real-time updates:
   - Implement Supabase realtime subscriptions for:
       trades_log inserts
       sessions_log inserts
   - If realtime unavailable, fallback to polling every 2 seconds (configurable).
4) Performance:
   - Use pagination / limit queries
   - Avoid loading huge logs.

Acceptance Criteria:
- Dashboard shows live data from trades_log/sessions_log for the logged in user.
- Updates appear within 1–2 seconds (realtime or polling fallback).
- No dummy data remains.

------------------------------------------------------------

PHASE 4 — ADMIN PANEL (COMPLETE)
Goal: Admin can see all users, credentials, settings, billing and logs.

Admin panel sections:
1) Users (profiles)
   - list all profiles
   - search by email/username
   - toggle is_admin (with confirmation)
   - view billing_plan
2) Credentials (api_credentials)
   - list all
   - filter by exchange/status
   - view masked key
   - allow status toggle (Active/Paused)
   - delete credential (danger zone)
3) Logs
   - trades_log global view
   - sessions_log global view
   - filter by email
   - show last 100 entries (paginate)
4) Settings (settings table)
   - edit all config fields
   - save updates
   - show “last updated” in UI (if no column, show “saved now” toast only)
5) Billing (billing table)
   - show plans (name, price, features array)
   - admin can create/update/delete plans

Acceptance Criteria:
- Admin-only gate enforced.
- All panels use Supabase data.
- No new tables.
- All actions have confirmation and toasts.

------------------------------------------------------------

PHASE 5 — COMMUNITY PAGE FRONTEND + CHAT FLOW (NO NEW TABLES)
Goal: Create community UI and define how chats will work, using existing schema.

Frontend:
1) Build community page UI:
   - left sidebar: channels (static list for now: General, Strategy, Help)
   - main: chat messages list
   - input box + send button
   - user avatar/name from profiles
2) Chat Flow Architecture (NO NEW TABLES):
   We cannot create chat tables, so store messages in sessions_log.trades (jsonb) as a structured payload.

Proposed message storage (example):
- Insert into sessions_log:
   email: sender email
   trades: {
     "type": "community_message",
     "channel": "general",
     "message": "text",
     "sender": { "email": "...", "username": "...", "avatar_url": "..." },
     "ts": "ISO timestamp"
   }

Fetching:
- Query sessions_log where trades->>'type'='community_message'
- Filter by channel inside json (client side or use Postgres json operators in RPC if needed; if RPC needed, do minimal and do not add tables)

Realtime:
- Subscribe to sessions_log inserts
- When new message arrives, append to chat feed

Moderation (admin):
- Admin can delete a message:
   Since sessions_log has no delete flag field, admin can either delete the row or insert a “delete event” message:
   trades: { type:"community_delete", targetId: <sessions_log.id> }
   UI hides deleted message if it finds delete event.

Acceptance Criteria:
- Community page looks complete and functional in UI.
- Messages can be sent and appear for all users (via realtime).
- Uses sessions_log only (no new tables).

------------------------------------------------------------

PHASE 6 — FINAL CHECKLIST + TEST PLAN (MUST PROVIDE)
Provide:
1) Env vars required (Vercel + Render)
2) Routes checklist
3) Quick test steps:
   - signup/login
   - create api credential
   - dashboard shows logs
   - admin panel access + toggles
   - community message send/receive

OUTPUT FORMAT
- Give me:
  1) the exact file changes (paths + code snippets)
  2) any SQL for RLS policies
  3) a short “how to test” checklist
- Keep code production-ready and consistent with existing project conventions.