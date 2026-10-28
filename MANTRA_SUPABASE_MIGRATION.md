# Mantra Supabase Migration

Date: 2026-10-28

## Current evidence

The repository contains Supabase SSR clients, a publishable browser key configuration, and one core SQL migration. The local `.env.example` declares:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Values were not printed or copied. No upload or remote retrieval was performed. Therefore, no asset is claimed as uploaded.

## Storage design

Use a private bucket named `mantra-character-assets` for processed PNGs and GLBs unless a project owner explicitly chooses public delivery. Recommended object paths:

- `characters/processed/<filename>.png`
- `characters/models/<filename>.glb`

Keep originals and processed rollback copies in the repository. Uploads must be idempotent and must never delete local files.

## Safe upload prerequisites

Run only from a trusted local environment with the server-only service key available through an ignored environment file:

```text
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-key>
```

Do not place `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables, client bundles, logs, manifests, or committed files. Use an authenticated Supabase server client for signed URL generation. Public URLs are appropriate only if the bucket is deliberately public.

## Required implementation sequence

1. Create the bucket with private visibility, or reuse an existing approved bucket.
2. Apply an asset metadata migration with object path, character identifier, media kind, source path, checksum, and review status.
3. Upload processed PNGs and matched GLBs with content types and cache headers.
4. Verify object metadata and retrieve a sample using a signed URL.
5. Record the verified bucket/path in `public/models/characters/character-manifest.json` and the character audit.
6. Resolve runtime URLs server-side. Use local paths as fallback when remote configuration or retrieval is unavailable.

## Not yet verified

- Supabase URL validity.
- Service-key availability.
- Storage permission.
- Bucket existence.
- Upload success.
- Signed URL retrieval.

The implementation must report these as unavailable rather than fabricate success.
