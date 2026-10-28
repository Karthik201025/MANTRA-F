# Dedicated Supabase RLS Test Setup

Use a separate Supabase project. Never point these tests at the Mantra production project.

## 1. Create the test project

Create a private Supabase project dedicated to automated testing. Keep its URL and keys local only.

## 2. Apply the schema

In the test project's SQL editor, review and apply:

```text
supabase/migrations/0001_mantra_core.sql
```

This setup guide does not apply SQL automatically.

## 3. Configure local variables

Copy `.env.rls-test.example` to `.env.rls-test`. Fill it with test-project values only. Do not commit the file or paste values into chat.

Required variables:

- `SUPABASE_RLS_TEST_URL`
- `SUPABASE_RLS_TEST_PUBLISHABLE_KEY`
- `SUPABASE_RLS_TEST_SERVICE_ROLE_KEY`
- `SUPABASE_RLS_TEST_USER_A_EMAIL`
- `SUPABASE_RLS_TEST_USER_A_PASSWORD`
- `SUPABASE_RLS_TEST_USER_B_EMAIL`
- `SUPABASE_RLS_TEST_USER_B_PASSWORD`

## 4. Required live assertions

Use two authenticated clients, one per synthetic user. Verify:

- User A cannot select User B's profile.
- User A cannot select User B's reflections.
- User A cannot select User B's reports.
- User A cannot update or delete User B's community posts.
- Inserts using a forged `author_id`, `reporter_id`, or `user_id` are rejected.
- Visible community posts remain readable according to the intended public policy.
- User B cannot read User A's private rows.

Use a service-role client only for controlled test setup/cleanup in the dedicated test project. Never use it in application code or browser tests.

## Current status

Live RLS tests remain pending until the dedicated project and synthetic credentials are configured locally. No production data has been modified.
