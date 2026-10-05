import { Apple, Globe, HardDriveDownload, ShieldCheck, Smartphone, Terminal } from 'lucide-react';
import { CopyCommand } from '@/components/copy-command';
import { PLAYER, RELEASES_PAGE, type Download, type Release } from '@/lib/release';
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
          href={direct.macArm?.url ?? RELEASES_PAGE}
          icon={<Apple className="size-5" />}
          label="macOS"
          note={direct.macArm?.size}
        />
        <Secondary
          href={android?.url ?? RELEASES_PAGE}
          icon={<Smartphone className="size-5" />}
          label="Android"
          note={android?.size}
        />
        <Secondary href={PLAYER} icon={<Globe className="size-5" />} label="Play in the browser" />
      </div>

      <p className="mx-auto mt-5 flex max-w-md items-start justify-center gap-2 text-center text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent/80" />
        <span>
          A small installer, for Noctorium, the Noctorium CLI or both. It fetches the current version, checks
          it against the checksum published beside it, and installs it. After that, both update themselves —
          Noctorium on Windows with one progress bar, opening again when it is done, and the CLI once a day.
        </span>
      </p>

      <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted-foreground">
        The macOS button is for Apple silicon, every Mac since late 2020.{' '}
        <a
          className="underline decoration-dotted underline-offset-4 hover:text-foreground"
          href={direct.macIntel?.url ?? RELEASES_PAGE}
        >
          An Intel Mac
        </a>{' '}
        has its own. Noctorium is not signed by Apple, so the first time, macOS asks: choose Open Anyway in
        System Settings, Privacy &amp; Security — or install it with the line below, which it does not ask about.
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
          <span className="opacity-60"> — Debian, Fedora, openSUSE and Arch, or an AppImage or Flatpak anywhere</span>
        </p>
      )}

      <div id="install" className="mx-auto mt-7 flex max-w-xl scroll-mt-8 flex-col gap-2">
        <p className="text-center text-sm text-muted-foreground">
          Or from a terminal. It asks whether you want Noctorium, the Noctorium CLI or both, downloads them at
          once, and checks them against the published checksums.
        </p>
        <CopyCommand label="Windows" command="irm https://noctorium.vercel.app/install | iex" />
        <CopyCommand label="macOS, Linux" command="curl -fsSL https://noctorium.vercel.app/install | sh" />
        <details className="mt-1">
          <summary className="cursor-pointer list-none text-center text-xs text-muted-foreground transition hover:text-foreground">
            <span className="underline decoration-dotted underline-offset-4">If this site is ever down: the same, straight from GitHub</span>
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            <CopyCommand label="Windows" command="irm https://raw.githubusercontent.com/Noctorium/Noctorium-Installer/main/scripts/install.ps1 | iex" />
            <CopyCommand label="macOS, Linux" command="curl -fsSL https://raw.githubusercontent.com/Noctorium/Noctorium-Installer/main/scripts/install.sh | sh" />
          </div>
        </details>
      </div>

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
          <Direct label="Arch .pkg.tar.zst" file={direct.arch} />
          <Direct label="Linux .AppImage" file={direct.appImage} />
          <Direct label="Flatpak" file={direct.flatpak} />
          <Direct label="macOS, Apple silicon" file={direct.macArm} />
          <Direct label="macOS, Intel" file={direct.macIntel} />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          These are the whole application, its own Java and Chromium inside, and on Windows and the Mac its own
          mpv. On Linux, mpv comes from your distribution, except in the Flatpak, which carries its own.
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
