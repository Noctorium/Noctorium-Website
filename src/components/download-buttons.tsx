import { HardDriveDownload, ShieldCheck, Smartphone, Terminal } from 'lucide-react';
import { RELEASES_PAGE, type Download, type Release } from '@/lib/release';
import { cn } from '@/lib/utils';

/**
 * What somebody came here for: the installer, not the application.
 *
 * The two small programs in the release repository -- `pc/` in Rust, `phone/` in Dart -- are what a
 * release is meant to be downloaded through. Each fetches the current version, checks it against the
 * checksum published beside it and hands it to Windows or to Android's own installer, so the file offered
 * here never goes stale and nobody has to pick the right one of nine.
 *
 * The application's own files stay on the page underneath, because somebody who wants the `.exe` itself
 * should not have to go and find the releases page to get it.
 */
export function DownloadButtons({ release }: { release: Release | null }) {
  const { windows, android, linux } = release?.installers ?? {};
  const direct = release?.direct ?? {};

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Primary
          href={windows?.url ?? RELEASES_PAGE}
          icon={<HardDriveDownload className="size-5" />}
          label="Download for Windows"
          note={windows?.size}
        />
        <Secondary
          href={android?.url ?? RELEASES_PAGE}
          icon={<Smartphone className="size-5" />}
          label="Android"
          note={android?.size}
        />
      </div>

      <p className="mx-auto mt-5 flex max-w-md items-start justify-center gap-2 text-center text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent/80" />
        <span>
          A small installer. It fetches the current version, checks it against the checksum published
          beside it, and hands it to Windows or to Android.
        </span>
      </p>

      {linux && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <a
            href={linux.url}
            className="inline-flex items-center gap-2 transition hover:text-foreground"
          >
            <Terminal className="size-4" />
            Linux installer <span className="opacity-60">({linux.size})</span>
          </a>
          <span className="opacity-60"> — Debian and Fedora</span>
        </p>
      )}

      <details className="group mx-auto mt-8 max-w-lg">
        <summary className="cursor-pointer list-none text-center text-sm text-muted-foreground transition hover:text-foreground">
          <span className="underline decoration-dotted underline-offset-4">
            Or take the files themselves
          </span>
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-border/60 bg-card/40 p-4 text-sm">
          <Direct label="Windows .exe" file={direct.windows} />
          <Direct label="Windows .msi" file={direct.windowsMsi} />
          <Direct label="Android .apk" file={direct.android} />
          <Direct label="Debian .deb" file={direct.debian} />
          <Direct label="Fedora .rpm" file={direct.fedora} />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          These are the whole application — mpv and yt-dlp travel inside them, which is where the size
          goes.
        </p>
      </details>

      <p className="mt-7 text-center text-xs text-muted-foreground">
        {release ? (
          <>
            Version {release.version} ·{' '}
            <a
              className="underline decoration-dotted underline-offset-4 hover:text-foreground"
              href={RELEASES_PAGE}
            >
              every file, with checksums
            </a>
          </>
        ) : (
          <a
            className="underline decoration-dotted underline-offset-4 hover:text-foreground"
            href={RELEASES_PAGE}
          >
            All downloads on the releases page
          </a>
        )}
      </p>
    </div>
  );
}

function Direct({ label, file }: { label: string; file?: Download }) {
  if (!file) return null;
  return (
    <a
      href={file.url}
      className="flex items-baseline justify-between gap-3 text-muted-foreground transition hover:text-foreground"
    >
      <span>{label}</span>
      <span className="text-xs opacity-60">{file.size}</span>
    </a>
  );
}

function Primary({
  href,
  icon,
  label,
  note,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-7 py-4',
        'font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition',
        'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      {icon}
      <span>{label}</span>
      {note && <span className="text-sm font-normal opacity-75">{note}</span>}
    </a>
  );
}

function Secondary({
  href,
  icon,
  label,
  note,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card/70 px-7 py-4',
        'font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      )}
    >
      {icon}
      <span>{label}</span>
      {note && <span className="text-sm font-normal text-muted-foreground">{note}</span>}
    </a>
  );
}
