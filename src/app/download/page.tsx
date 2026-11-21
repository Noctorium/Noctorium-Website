import type { Metadata } from 'next';
import {
  Apple,
  AppWindow,
  AudioLines,
  ChartColumn,
  Feather,
  Globe,
  HardDriveDownload,
  Smartphone,
  SquareTerminal,
  Terminal,
  Zap,
} from 'lucide-react';
import { CopyCommand } from '@/components/copy-command';
import { ObtainiumButtons } from '@/components/obtainium';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { latestRelease, PLAYER, RELEASES_PAGE, type Download } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Download Noctorium',
  description: 'Noctorium for Windows, macOS, Linux, Android and iPhone, in a terminal, or in the browser — every file and every way to install it.',
};

/**
 * Every way to get Noctorium, on one page, so the home page needs only one button.
 *
 * What a release has is asked of GitHub (see lib/release.ts); a file the latest release does not carry is simply
 * not listed, and a section with nothing in it is left out.
 */
export default async function DownloadPage() {
  const release = await latestRelease();
  const r = release;
  const jump = [
    ['windows', 'Windows'],
    ['macos', 'macOS'],
    ['linux', 'Linux'],
    ['android', 'Android'],
    ...(r?.ios ? [['iphone', 'iPhone']] : []),
    ['browser', 'Browser'],
    ['terminal', 'One line'],
    ['more', 'More apps'],
  ];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <SiteHeader />

      <section className="pb-10 pt-6 text-center sm:pt-10">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Download Noctorium</h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          {r ? <>Version {r.version}. </> : null}
          Pick your device. Every file is checked against the checksum published with the release, and Noctorium
          keeps itself up to date after that.
        </p>
        <nav className="mt-6 flex flex-wrap justify-center gap-2">
          {jump.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <section className="grid gap-4 pb-14 md:grid-cols-2">
        <Card id="windows" icon={<AppWindow className="size-5" />} title="Windows" note="Windows 10 and 11, 64-bit">
          <Main file={r?.installers.windows} label="Download the installer" />
          <p className="mt-3 text-sm text-muted-foreground">
            A small program that fetches the current Noctorium, checks it and installs it — or the CLI, Stats, Rust
            and Song Find too, if you tick them.
          </p>
          <Files files={[['Noctorium setup .exe', r?.direct.windows], ['Noctorium .msi', r?.direct.windowsMsi], ['Installer for a terminal', r?.installers.windowsCli]]} />
        </Card>

        <Card id="macos" icon={<Apple className="size-5" />} title="macOS" note="Apple silicon and Intel">
          <Main file={r?.direct.macArm} label="Download for Apple silicon" />
          <p className="mt-3 text-sm text-muted-foreground">
            Every Mac since late 2020. Open the .dmg and drag Noctorium into Applications. It is not signed by
            Apple, so the first time choose Open Anyway in System Settings › Privacy &amp; Security — or use the
            one line below, which skips that.
          </p>
          <Files files={[['Intel Mac .dmg', r?.direct.macIntel], ['Installer for a terminal', r?.installers.macCli]]} />
        </Card>

        <Card id="linux" icon={<Terminal className="size-5" />} title="Linux" note="Debian, Ubuntu, Fedora, openSUSE, Arch and the rest">
          <Main file={r?.installers.linux} label="Download the installer" />
          <p className="mt-3 text-sm text-muted-foreground">
            It picks the right package for your distribution. mpv comes from your distribution, except in the
            Flatpak, which carries its own.
          </p>
          <Files
            files={[
              ['Debian, Ubuntu, Mint .deb', r?.direct.debian],
              ['Fedora, openSUSE .rpm', r?.direct.fedora],
              ['Arch .pkg.tar.zst', r?.direct.arch],
              ['AppImage', r?.direct.appImage],
              ['Flatpak', r?.direct.flatpak],
              ['Installer as an AppImage', r?.installers.linuxAppImage],
              ['Installer for a terminal', r?.installers.linuxCli],
            ]}
          />
        </Card>

        <Card id="android" icon={<Smartphone className="size-5" />} title="Android" note="Phones, Android TV and Android Auto">
          <Main file={r?.direct.android} label="Download the APK" />
          <p className="mt-3 text-sm text-muted-foreground">
            One app for the phone, the car with Android Auto and the TV with Android TV and Google TV. It updates
            itself. Android Auto lists apps from outside Google Play once you turn on <em>Unknown sources</em> in
            its developer settings (tap its version ten times).
          </p>
          <Files
            files={[
              ['Noctorium Lite — very small, for any phone', r?.lite],
              ['Installer app', r?.installers.android],
            ]}
          />
          <a href="#obtainium" className="mt-3 inline-block text-sm text-accent underline decoration-dotted underline-offset-4 hover:text-foreground">
            Or keep it up to date with Obtainium
          </a>
        </Card>

        {r?.ios && (
          <Card id="iphone" icon={<Apple className="size-5" />} title="iPhone and iPad" note="iOS 16 and newer">
            <Main file={r.ios} label="Download the .ipa" />
            <p className="mt-3 text-sm text-muted-foreground">
              Not on the App Store: install it with AltStore or SideStore, which sign it with your own Apple ID
              and renew it every week.
            </p>
          </Card>
        )}

        <Card id="browser" icon={<Globe className="size-5" />} title="In the browser" note="Nothing to install">
          <a href={PLAYER} className={mainButton}>
            <Globe className="size-5" />
            Open the web player
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            YouTube Music and SoundCloud with no account, your likes and playlists kept in the browser. With your
            own accounts, <code className="text-accent">noctorium web</code> serves the same player from your
            computer to every browser in the house.
          </p>
        </Card>
      </section>

      <section id="terminal" className="scroll-mt-8 pb-14">
        <Heading title="In one line" body="From PowerShell on Windows or a terminal on macOS or Linux. It asks which of Noctorium, the CLI, Stats, Rust and Song Find you want, downloads them and checks them against the published checksums." />
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
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
      </section>

      <section id="more" className="scroll-mt-8 pb-14">
        <Heading title="More apps" body="Each is its own download, from the same release." />
        <div className="grid gap-4 md:grid-cols-2">
          <Card id="cli" icon={<SquareTerminal className="size-5" />} title="Noctorium CLI" note="The whole player in a terminal">
            <code className="block rounded-md bg-background/70 px-3 py-2 text-xs text-accent">noctorium play daft punk</code>
            <Files files={[['Windows', r?.cli.windows], ['Linux', r?.cli.linux], ['macOS, Apple silicon', r?.cli.macArm], ['macOS, Intel', r?.cli.macIntel]]} />
          </Card>
          <Card id="rust" icon={<Zap className="size-5" />} title="Noctorium Rust" note="The same player as one small native program">
            <Files files={[['Windows', r?.rust.windows], ['Linux', r?.rust.linux], ['macOS, Apple silicon', r?.rust.macArm], ['macOS, Intel', r?.rust.macIntel]]} />
          </Card>
          {r?.lite && (
            <Card id="lite" icon={<Feather className="size-5" />} title="Noctorium Lite" note="A tiny Android app, for older and smaller phones">
              <Files files={[['Android', r.lite]]} />
            </Card>
          )}
          <Card id="stats" icon={<ChartColumn className="size-5" />} title="Noctorium Stats" note="Your listening, from your Noctorium account">
            <Files files={[['Windows', r?.stats.windows], ['Linux', r?.stats.linux], ['macOS, Apple silicon', r?.stats.macArm], ['macOS, Intel', r?.stats.macIntel], ['Android', r?.stats.android]]} />
          </Card>
          <Card id="song-find" icon={<AudioLines className="size-5" />} title="Noctorium Song Find" note="Which song is this?">
            <Files files={[['Windows', r?.songFind.windows], ['Linux', r?.songFind.linux], ['macOS, Apple silicon', r?.songFind.macArm], ['macOS, Intel', r?.songFind.macIntel], ['Android', r?.songFind.android]]} />
          </Card>
        </div>
      </section>

      <section id="obtainium" className="scroll-mt-8 pb-14">
        <Heading title="On Android, with Obtainium" body="Obtainium installs Android apps straight from their releases and keeps them up to date. Tap one on a phone or TV with Obtainium installed and it opens with the app set up." />
        <div className="rounded-xl border border-border/70 bg-card/50 p-6">
          <ObtainiumButtons hasLite={Boolean(r?.lite)} />
        </div>
      </section>

      <p className="pb-12 text-center text-sm text-muted-foreground">
        Every release has a <code className="text-accent">SHA256SUMS.txt</code> beside its files.{' '}
        <a href={RELEASES_PAGE} className="underline decoration-dotted underline-offset-4 hover:text-foreground">
          Every file, with checksums, on the releases page
        </a>
        .
      </p>

      <SiteFooter />
    </main>
  );
}

const mainButton =
  'inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30';

function Heading({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">{body}</p>
    </div>
  );
}

function Card({ id, icon, title, note, children }: { id: string; icon: React.ReactNode; title: string; note: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-8 rounded-xl border border-border/70 bg-card/50 p-6 backdrop-blur transition hover:border-primary/40">
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent">{icon}</div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/** The one file most people want from a card, as a big button; the releases page when the release lacks it. */
function Main({ file, label }: { file?: Download; label: string }) {
  return (
    <a href={file?.url ?? RELEASES_PAGE} className={mainButton}>
      <HardDriveDownload className="size-5" />
      {label}
      {file && <span className="text-sm font-normal opacity-75">{file.size}</span>}
    </a>
  );
}

/** The other files, one to a line; any the release does not carry are left out. */
function Files({ files }: { files: [string, Download | undefined][] }) {
  const present = files.filter(([, file]) => file);
  if (!present.length) return null;
  return (
    <div className="mt-4 flex flex-col divide-y divide-border/50 rounded-lg border border-border/60 bg-background/40 text-sm">
      {present.map(([label, file]) => (
        <a key={label} href={file!.url} className="flex items-baseline justify-between gap-3 px-3 py-2 text-muted-foreground transition hover:text-foreground">
          <span>{label}</span>
          <span className="shrink-0 text-xs opacity-60">{file!.size}</span>
        </a>
      ))}
    </div>
  );
}
