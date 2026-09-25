import { Apple, HardDriveDownload, Smartphone, Terminal } from 'lucide-react';
import { RELEASES_PAGE, type Release } from '@/lib/release';
import { cn } from '@/lib/utils';

/**
 * What somebody came here for.
 *
 * Windows first because that is what most people arrive on, and the size on every button because these
 * are hundreds of megabytes -- they carry mpv and yt-dlp inside them -- and finding that out halfway
 * through a download on a phone connection is a poor surprise.
 */
export function DownloadButtons({ release }: { release: Release | null }) {
  const windows = release?.downloads.windows;
  const android = release?.downloads.android;
  const debian = release?.downloads.debian;
  const fedora = release?.downloads.fedora;

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
          label="Android APK"
          note={android?.size}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {debian && (
          <Quiet href={debian.url} icon={<Terminal className="size-4" />}>
            .deb <span className="opacity-60">({debian.size})</span>
          </Quiet>
        )}
        {fedora && (
          <Quiet href={fedora.url} icon={<Terminal className="size-4" />}>
            .rpm <span className="opacity-60">({fedora.size})</span>
          </Quiet>
        )}
        <Quiet href={RELEASES_PAGE} icon={<Apple className="size-4 opacity-60" />}>
          <span className="opacity-70">No macOS build yet</span>
        </Quiet>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {release ? (
          <>
            Version {release.version} ·{' '}
            <a className="underline decoration-dotted underline-offset-4 hover:text-foreground" href={RELEASES_PAGE}>
              every file, with checksums
            </a>
          </>
        ) : (
          <a className="underline decoration-dotted underline-offset-4 hover:text-foreground" href={RELEASES_PAGE}>
            All downloads on the releases page
          </a>
        )}
      </p>
    </div>
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

function Quiet({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="inline-flex items-center gap-2 transition hover:text-foreground">
      {icon}
      {children}
    </a>
  );
}
