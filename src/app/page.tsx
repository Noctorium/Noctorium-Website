import Image from 'next/image';
import {
  Activity,
  AppWindow,
  AudioLines,
  BatteryCharging,
  Disc3,
  Globe,
  SquareTerminal,
  Smartphone,
  Download,
  Github,
  Heart,
  Library,
  ListMusic,
  Lock,
  MicVocal,
  MonitorSmartphone,
  Palette,
  Radio,
} from 'lucide-react';
import { DownloadButtons } from '@/components/download-buttons';
import { WhatsNew } from '@/components/whats-new';
import { latestRelease, PLAYER, recentReleases, RELEASES_PAGE, type Release } from '@/lib/release';

const GITHUB = 'https://github.com/Noctorium';

export default async function Home() {
  const [release, notes] = await Promise.all([latestRelease(), recentReleases(3)]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-6">
        <span className="flex items-center gap-2.5">
          <Image src="/noctorium.png" alt="" width={28} height={28} className="rounded-md" priority />
          <span className="font-semibold tracking-tight">Noctorium</span>
        </span>
        <a
          href={GITHUB}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <Github className="size-4" />
          <span className="hidden sm:inline">Source</span>
        </a>
      </header>

      <section className="flex flex-col items-center pb-16 pt-10 text-center sm:pt-20">
        <div className="relative animate-rise">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 animate-breathe rounded-full bg-primary/40 blur-3xl"
          />
          <Image
            src="/noctorium.png"
            alt="Noctorium"
            width={132}
            height={132}
            className="rounded-[26px] shadow-2xl shadow-primary/20"
            priority
          />
        </div>

        <h1
          className="mt-9 animate-rise text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ animationDelay: '60ms' }}
        >
          Two services.{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            One player.
          </span>
        </h1>

        <p
          className="mt-5 max-w-xl animate-rise text-pretty text-lg text-muted-foreground"
          style={{ animationDelay: '120ms' }}
        >
          YouTube Music and SoundCloud, in one library, on your desktop, your phone, in a terminal or right
          in your browser. Your own accounts — your likes and playlists are written to them, not kept in a copy
          here.
        </p>

        <div className="mt-11 w-full animate-rise" style={{ animationDelay: '180ms' }}>
          <DownloadButtons release={release} />
        </div>
      </section>

      <Platforms release={release} />

      <WhatsNew releases={notes} />

      <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<Radio className="size-5" />}
          title="Both libraries, side by side"
          body="Search once and see results from both. Your playlists and liked tracks from each service sit in the same library, and a queue can hold songs from either."
        />
        <Feature
          icon={<Heart className="size-5" />}
          title="Likes go to the real account"
          body="Liking a track in Noctorium likes it on SoundCloud or YouTube Music. Open the service tomorrow on any other device and it is there, because it was never only here."
        />
        <Feature
          icon={<ListMusic className="size-5" />}
          title="Playlists you can actually edit"
          body="Make one on either account, add tracks, put them in order, rename it, make it public or private, delete it — from the desktop or the phone. Long ones open whole. Private by default."
        />
        <Feature
          icon={<Library className="size-5" />}
          title="Your Spotify library too"
          body="Your Spotify playlists and liked songs, in your order. Spotify gives no audio to other players, so each song is found on YouTube Music or SoundCloud as it plays."
        />
        <Feature
          icon={<MicVocal className="size-5" />}
          title="Lyrics that follow along"
          body="Synced lyrics from eight sources, with the line being sung lit up. Switch source right on the lyrics, and later songs open on your pick when it has them."
        />
        <Feature
          icon={<Lock className="size-5" />}
          title="Signing in, on their page"
          body="Your password goes to Google's or SoundCloud's own page, shown inside Noctorium, never to a form of ours. Only the session is kept, on your device. Or sign the desktop in by scanning a code with your phone."
        />
        <Feature
          icon={<Palette className="size-5" />}
          title="Make it yours"
          body="Nineteen themes, from Catppuccin and Nord to pure black crimson for OLED screens, and Windows 98 and XP. Accent colours, liquid glass, six seek bars, six layouts for now playing with a cover that can turn like a record, and animations you can switch off."
        />
        <Feature
          icon={<BatteryCharging className="size-5" />}
          title="Keeps playing"
          body="Close the window and the music carries on from the tray, or have Noctorium start with Windows. On the phone it plays on with the screen locked, even on phones that like to close apps."
        />
        <Feature
          icon={<Download className="size-5" />}
          title="Offline, when you want it"
          body="Keep a song or a whole playlist to play without a connection. On the desktop they are saved as MP3s with their covers; on the phone, only over Wi-Fi if you like."
        />
        <Feature
          icon={<Activity className="size-5" />}
          title="Scrobbling and Discord"
          body="Every listen goes to Last.fm and ListenBrainz, and the desktop shows what you are playing on Discord."
        />
        <Feature
          icon={<MonitorSmartphone className="size-5" />}
          title="Desktop and phone, together"
          body="Windows, macOS, Linux — Debian, Fedora, Arch, an AppImage or a Flatpak — and Android, built from one shared core so they behave the same rather than nearly the same. With Connect, move the music from one to the other and it carries on from the same second."
        />
        <Feature
          icon={<Github className="size-5" />}
          title="Open, and yours"
          body="Every repository is public and the releases carry checksums. No telemetry and nothing to subscribe to; an account with us only if you want your listening counted."
        />
      </section>

      <Goals />

      <footer className="mt-auto flex flex-col items-center gap-2 border-t border-border/60 py-8 text-sm text-muted-foreground">
        <p>
          Noctorium plays from YouTube Music and SoundCloud using your own accounts. It is not affiliated
          with either.
        </p>
        <a href={GITHUB} className="transition hover:text-foreground">
          github.com/Noctorium
        </a>
      </footer>
    </main>
  );
}

/** Four ways in, the same library behind each. */
function Platforms({ release }: { release: Release | null }) {
  const cli = release?.cli ?? {};
  return (
    <section className="pb-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">Wherever you listen</h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
        The same library, queue and likes on each — they all stand on one shared core.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Platform icon={<AppWindow className="size-5" />} title="Desktop" body="Windows, macOS and Linux, in a window of its own, in the tray or the menu bar when you close it." />
        <Platform icon={<Smartphone className="size-5" />} title="Phone" body="Android, with the lock screen, the notification and playing on with the screen off." />
        <Platform icon={<SquareTerminal className="size-5" />} title="Terminal" body="noctorium — the whole player in a terminal: covers, synced lyrics, every theme, by keyboard or mouse. It keeps itself up to date. Pick it in the installer or the one line above.">
          <code className="mt-3 block rounded-md bg-background/70 px-3 py-2 text-xs text-accent">noctorium play daft punk</code>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a className="underline decoration-dotted underline-offset-4 hover:text-foreground" href={cli.windows?.url ?? RELEASES_PAGE}>Windows</a>
            <a className="underline decoration-dotted underline-offset-4 hover:text-foreground" href={cli.linux?.url ?? RELEASES_PAGE}>Linux</a>
            <a className="underline decoration-dotted underline-offset-4 hover:text-foreground" href={cli.macArm?.url ?? RELEASES_PAGE}>macOS</a>
          </div>
        </Platform>
        <Platform icon={<Globe className="size-5" />} title="Browser" body="Open the web player and play — nothing to install, no account, your likes and playlists kept in the browser.">
          <a className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110" href={PLAYER}>
            Open the web player
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            With your own accounts: <code className="text-accent">noctorium web</code> serves it from your computer to every browser in the house.
          </p>
        </Platform>
      </div>
    </section>
  );
}

/** Where Noctorium is heading: goals to work towards, said as such rather than as promises with dates. */
function Goals() {
  return (
    <section id="goals" className="scroll-mt-8 pb-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">On the way</h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">What Noctorium is working towards next.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Platform
          icon={<Disc3 className="size-5" />}
          title="Bandcamp support"
          body="Bandcamp as a service of its own: search it, play its albums and tracks, and find your Bandcamp collection in the library beside the others."
        />
        <Platform
          icon={<AudioLines className="size-5" />}
          title="Full Spotify support"
          body="Spotify as a whole service, not only a library to read: search it, browse its albums and artists, and like songs and edit playlists on Spotify itself, as Noctorium already does on YouTube Music and SoundCloud."
        />
      </div>
    </section>
  );
}

function Platform({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/50 p-6 text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:bg-card/80">
      <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-accent">{icon}</div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed">{body}</p>
      {children}
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/50 p-6 backdrop-blur transition hover:border-primary/40 hover:bg-card/80">
      <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/15 text-accent">
        {icon}
      </div>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
