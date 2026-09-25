# Noctorium's page

One page, whose job is to say what Noctorium is and hand somebody the right file.

```bash
npm install
npm run dev      # http://localhost:9003
```

## Where the downloads come from

Nothing about a release is written down here. The page asks
`Noctorium/Noctorium-Installer` for its latest release and reads the version, the file names and the
sizes out of the answer — the same release the applications check for updates, so the page cannot
advertise a version nobody can install.

The answer is cached for fifteen minutes: a burst of visitors is one request to GitHub, and a release
appears here within the hour it is published. If GitHub cannot be reached the page still renders and every
button falls back to the releases page.

One rule in `src/lib/release.ts` is worth knowing about. A release carries two `.apk` files — the player
and the phone installer — and three `.exe` files, so every match is a suffix plus an exclusion rather than
"ends with .apk". A looser rule offers whichever GitHub happens to list first, which is right about half
the time.

## The colours

`--primary` and `--accent` in `globals.css` are `NoctoriumPurpleStrong` and `NoctoriumLavender` from the
desktop's `Theme.kt`, converted to HSL. The mark in `public/` is the application's own artwork, copied from
`Noctorium-Desktop/src/main/resources`. If either changes there, change it here.

## Deploying

A stock Next.js app: `npm run build`, then any host that runs Node. Set `NEXT_PUBLIC_SITE_URL` to the
domain it is served from, or let Vercel's own variable do it — without one the social preview resolves its
image against localhost and link cards unfurl blank.
