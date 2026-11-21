import type { Metadata } from 'next';
import { AudioLines, ChartColumn, ChevronDown, Feather, ShieldCheck, SquareTerminal, Zap } from 'lucide-react';
import { CopyCommand } from '@/components/copy-command';
import { DownloadPicker, type Platform } from '@/components/download-picker';
import { ObtainiumButtons } from '@/components/obtainium';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { latestRelease, PLAYER, RELEASES_PAGE, type Download, type Release } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Download Noctorium',
  description: 'Noctorium for Windows, macOS, Linux, Android and iPhone, in a terminal, or in the browser.',
};

type Files = [string, Download | undefined][];
const present = (files: Files) => files.filter((f): f is [string, Download] => Boolean(f[1])).map(([label, file]) => ({ label, file }));

/** Every system's downloads, from what the latest release actually has. A system with nothing to offer is left out. */
function platforms(r: Release | null): Platform[] {
  const fallback = RELEASES_PAGE;
  const list: Platform[] = [
    {
      id: 'windows', label: 'Windows', action: 'Download for Windows',
      href: r?.installers.windows?.url ?? fallback, size: r?.installers.windows?.size,
      note: 'A small installer that fetches the current Noctorium, checks it against its published checksum and installs it — and the CLI, Stats, Rust or Song Find too, if you tick them. After that, Noctorium updates itself.',
      files: present([['Noctorium setup .exe', r?.direct.windows], ['Noctorium .msi', r?.direct.windowsMsi]]),
      also: present([['Noctorium Installer CLI', r?.installers.windowsCli]]),
    },
    {
      id: 'macos', label: 'Mac', action: 'Download for Mac',
      href: r?.direct.macArm?.url ?? fallback, size: r?.direct.macArm?.size,
      note: 'For Apple silicon, every Mac since late 2020. Open the .dmg and drag Noctorium into Applications; it is not signed by Apple, so the first time choose Open Anyway in System Settings › Privacy & Security — or use the one line under Terminal, which skips that.',
      files: present([['Intel Mac .dmg', r?.direct.macIntel]]),
      also: present([['Noctorium Installer CLI', r?.installers.macCli]]),
    },
    {
      id: 'linux', label: 'Linux', action: 'Download for Linux',
      href: r?.installers.linux?.url ?? fallback, size: r?.installers.linux?.size,
      note: 'The installer picks the right package for Debian, Ubuntu, Fedora, openSUSE or Arch. mpv comes from your distribution, except in the Flatpak, which carries its own.',
      files: present([
        ['Debian, Ubuntu, Mint .deb', r?.direct.debian], ['Fedora, openSUSE .rpm', r?.direct.fedora], ['Arch .pkg.tar.zst', r?.direct.arch],
        ['AppImage', r?.direct.appImage], ['Flatpak', r?.direct.flatpak], ['Installer as an AppImage', r?.installers.linuxAppImage],
      ]),
      also: present([['Noctorium Installer CLI', r?.installers.linuxCli]]),
    },
    {
      id: 'android', label: 'Android', action: 'Download for Android',
      href: r?.direct.android?.url ?? fallback, size: r?.direct.android?.size,
      note: 'One app for the phone, Android Auto and Android TV, and it updates itself. For an older or smaller phone, Noctorium Lite is the same music in a fraction of the space.',
      files: present([['Noctorium Lite — about 125 KB, Android 5 and up', r?.lite], ['Installer app', r?.installers.android]]),
    },
    ...(r?.ios ? [{
      id: 'iphone' as const, label: 'iPhone', action: 'Download for iPhone and iPad',
      href: r.ios.url, size: r.ios.size,
      note: 'Not on the App Store: install the .ipa with AltStore or SideStore, which sign it with your own Apple ID. Or play in the browser, with nothing to install.',
      files: [],
    }] : []),
    {
      id: 'browser', label: 'Browser', action: 'Open the web player', href: PLAYER,
      note: 'YouTube Music and SoundCloud with nothing to install and no account, your likes and playlists kept in the browser. With your own accounts, noctorium web serves the same player from your computer to every browser in the house.',
      files: [],
    },
    {
      id: 'terminal', label: 'Terminal', action: 'Get the CLI', href: '#cli',
      note: 'The whole player in a terminal — covers, synced lyrics, every theme, by keyboard or mouse. Or install anything with one line: it asks which of Noctorium, the CLI, Stats, Rust and Song Find you want.',
      files: present([['CLI for Windows', r?.cli.windows], ['CLI for Linux', r?.cli.linux], ['CLI for Apple silicon', r?.cli.macArm], ['CLI for an Intel Mac', r?.cli.macIntel]]),
    },
  ];
  return list;
}

export default async function DownloadPage() {
  const r = await latestRelease();

  const oneLine = (
    <div className="flex flex-col gap-2">
      <CopyCommand label="Windows" command="irm https://noctorium.xyz/install | iex" />
      <CopyCommand label="macOS, Linux" command="curl -fsSL https://noctorium.xyz/install | sh" />
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
  );

  const obtainium = (
    <details className="group rounded-xl border border-border/60 bg-background/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground [&::-webkit-details-marker]:hidden">
        Keep it up to date with Obtainium
        <ChevronDown className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/50 p-4">
        <ObtainiumButtons hasLite={Boolean(r?.lite)} />
      </div>
    </details>
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <SiteHeader />

      <section className="pb-8 pt-6 text-center sm:pt-10">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Download Noctorium</h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          {r ? <>Version {r.version} — </> : null}free, open source, and it keeps itself up to date.
        </p>
      </section>

      <section className="pb-16">
        <DownloadPicker platforms={platforms(r)} extras={{ android: obtainium, terminal: oneLine }} />
        <p className="mx-auto mt-4 flex max-w-lg items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="mt-px size-4 shrink-0 text-accent/80" />
          <span>
            Every file is checked against the release&apos;s <code className="text-accent">SHA256SUMS.txt</code> before it is installed.{' '}
            <a href={RELEASES_PAGE} className="underline decoration-dotted underline-offset-4 hover:text-foreground">All files on the releases page</a>
          </span>
        </p>
      </section>

      <section id="more" className="scroll-mt-8 pb-16">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">More from Noctorium</h2>
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-muted-foreground">Apps of their own, in the same release.</p>
        {/* items-start: a tile opened to its files grows alone, rather than stretching the one beside it. */}
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <AppTile id="cli" icon={<SquareTerminal className="size-5" />} title="Noctorium CLI" body="The whole player in a terminal, and noctorium web for every browser in the house."
            files={[['Windows', r?.cli.windows], ['Linux', r?.cli.linux], ['macOS, Apple silicon', r?.cli.macArm], ['macOS, Intel', r?.cli.macIntel]]} />
          <AppTile id="rust" icon={<Zap className="size-5" />} title="Noctorium Rust" body="The same player as one small native program."
            files={[['Windows', r?.rust.windows], ['Linux', r?.rust.linux], ['macOS, Apple silicon', r?.rust.macArm], ['macOS, Intel', r?.rust.macIntel]]} />
          {r?.lite && (
            <AppTile id="lite" icon={<Feather className="size-5" />} title="Noctorium Lite" body="Noctorium for Android in about 125 KB, for any phone from Android 5."
              files={[['Android', r.lite]]} />
          )}
          <AppTile id="stats" icon={<ChartColumn className="size-5" />} title="Noctorium Stats" body="Your listening, in figures, from your Noctorium account."
            files={[['Windows', r?.stats.windows], ['Linux', r?.stats.linux], ['macOS, Apple silicon', r?.stats.macArm], ['macOS, Intel', r?.stats.macIntel], ['Android', r?.stats.android]]} />
          <AppTile id="song-find" icon={<AudioLines className="size-5" />} title="Noctorium Song Find" body="Which song is this? From the microphone or what is playing."
            files={[['Windows', r?.songFind.windows], ['Linux', r?.songFind.linux], ['macOS, Apple silicon', r?.songFind.macArm], ['macOS, Intel', r?.songFind.macIntel], ['Android', r?.songFind.android]]} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

/** One of the other apps: its name and what it is, opening to its files. */
function AppTile({ id, icon, title, body, files }: { id: string; icon: React.ReactNode; title: string; body: string; files: Files }) {
  const list = present(files);
  return (
    <details id={id} className="group scroll-mt-8 rounded-xl border border-border/70 bg-card/50 transition hover:border-primary/40 open:border-primary/40">
      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-foreground">{title}</span>
          <span className="block text-sm text-muted-foreground">{body}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="divide-y divide-border/50 border-t border-border/50">
        {list.length ? list.map(({ label, file }) => (
          <a key={label} href={file.url} className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-primary/5 hover:text-foreground">
            <span>{label}</span>
            <span className="shrink-0 text-xs opacity-60">{file.size}</span>
          </a>
        )) : <a href={RELEASES_PAGE} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">On the releases page</a>}
      </div>
    </details>
  );
}
