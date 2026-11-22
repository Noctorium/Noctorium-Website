import Image from 'next/image';
import Link from 'next/link';
import {
  History,
  Volume2,
  AppWindow,
  AudioLines,
  BatteryCharging,
  Car,
  ChartColumn,
  Disc3,
  FileUp,
  Globe,
  Joystick,
  ListPlus,
  RadioTower,
  Table2,
  Tv,
  MessagesSquare,
  SquareTerminal,
  Smartphone,
  Download,
  Github,
  Heart,
  Keyboard,
  Library,
  Lock,
  Music4,
  MicVocal,
  MonitorSmartphone,
  Palette,
  Radio,
  Send,
  TriangleAlert,
  Search,
  UserRound,
  KeyRound,
  WandSparkles,
  ArrowRight,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { WhatsNew } from '@/components/whats-new';
import { latestRelease, PLAYER, recentReleases, RELEASES_PAGE, TELEGRAM, type Release } from '@/lib/release';

/** The account service's own site, where the same statistics are read in a browser. */
const STATS_SITE = 'https://service.noctorium.xyz';

export default async function Home() {
  const [release, notes] = await Promise.all([latestRelease(), recentReleases(3)]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <SiteHeader />

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
          All your music.{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            One player.
          </span>
        </h1>

        <p
          className="mt-5 max-w-xl animate-rise text-pretty text-lg text-muted-foreground"
          style={{ animationDelay: '120ms' }}
        >
          YouTube Music, SoundCloud, Bandcamp, Spotify, VK Music, Apple Music, Deezer and Tidal, in one library, on
          your desktop, your phone, in a terminal or right in your browser. Your own accounts — your likes and
          playlists are written to them, not kept in a copy here.
        </p>

        <div className="mt-11 w-full animate-rise" style={{ animationDelay: '180ms' }}>
          <HeroDownload version={release?.version} />
        </div>
      </section>

      <Platforms />

      <CarAndTv />

      <Stats />

      <SongFind />

      <WhatsNew releases={notes} />

      <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<Radio className="size-5" />}
          title="Every library, side by side"
          body="Search once and see results from every service you use. Your playlists and liked songs from each sit in the same library, and a queue can hold songs from any of them."
        />
        <Feature
          icon={<UserRound className="size-5" />}
          title="Artists, albums and playlists"
          body="An artist's page is a whole page: a banner, their popular songs, then albums, singles, videos, playlists and artists like them, from YouTube Music and SoundCloud. Search for playlists too, beside Music, Radio and Artists. In the library, your liked songs come first, in a card of their own."
        />
        <Feature
          icon={<Search className="size-5" />}
          title="Pull down to search"
          body="On the phone, pull down at the top of Home and the search bar appears, as Ctrl+F does on the computer. Two menus beside it pick the service — every one at once, YouTube Music, SoundCloud and the rest — and what to look for: Music, Radio, Artists or Playlists."
        />
        <Feature
          icon={<WandSparkles className="size-5" />}
          title="Set up in a minute, or not at all"
          body="The first time Noctorium opens, a few quick steps: a theme, where to search, autoplay, and your accounts. Skip it whenever you like and choose later in Settings. It shows once — not after an update, not after a restart, and never to anyone who used Noctorium before it. Home's layout has a place of its own in Settings, too."
        />
        <Feature
          icon={<Heart className="size-5" />}
          title="Your real accounts"
          body="Liking a song likes it on YouTube Music, SoundCloud or Spotify, or adds it to My music on VK, and the playlists you make, rename, reorder or make public or private — unlisted too, on YouTube Music — live on the service, changed from the computer or the phone alike. Open it tomorrow on any other device and it is all there, because it was never only here."
        />
        <Feature
          icon={<AudioLines className="size-5" />}
          title="Spotify, signed in"
          body="Signed in: your playlists and liked songs, Spotify in search, and hearts that save to Liked Songs, each song played from YouTube Music. With Premium, Spotify songs play in your own Spotify app instead — on this computer, your phone or a speaker — while Noctorium follows along."
        />
        <Feature
          icon={<FileUp className="size-5" />}
          title="Spotify playlists, no sign-in needed"
          body="Spotify answers the sign-in only while the owner of Noctorium's Spotify app has Premium, so there are two ways in without one. Follow a public playlist by its link and it stays in step with Spotify — only its first 100 songs, as that is all Spotify's public page shows. Or import Spotify's own data download: every playlist you made and your Liked Songs, as playlists of your own."
        />
        <Feature
          icon={<Disc3 className="size-5" />}
          title="Bandcamp, with nothing to sign in to"
          body="Search it, open its albums and artists, and get its best-sellers and new releases on Home, in the genres you pick. Give your Bandcamp name and your collection is in the library. Songs are bought there, not downloaded."
        />
        <Feature
          icon={<Library className="size-5" />}
          title="VK Music"
          body="Sign in on VK's own page: My music, your playlists, search and VK's suggestions. VK offers its music to no other app, so this uses your session the way its web player does — its terms do not allow that, and many songs do not play outside Russia."
        />
        <Feature
          icon={<Music4 className="size-5" />}
          title="Apple Music, Deezer and Tidal"
          body="Search them, open their albums, artists and playlists, paste their links, and see your library from them. Deezer needs only your public profile, Apple Music signs in on Apple's own page, and Tidal on Tidal's, with a free developer app of your own that Settings walks you through. None lets another app play its music, so each song is played as the same recording on YouTube Music."
        />
        <Feature
          icon={<RadioTower className="size-5" />}
          title="Radio from every country"
          body="Switch the search from Music to Radio and tune in to tens of thousands of live stations from more than two hundred countries, from the open Radio Browser list: the most listened-to wherever you pick, or a station, a city or a kind of music by name. In the quick search bar, Ctrl+F again switches between the two."
        />
        <Feature
          icon={<Joystick className="size-5" />}
          title="A remote control in your browser"
          body="Switch on Settings › This device › Remote control on the desktop and open localhost:6932: play, pause, skip, seek, the volume, the queue, synced lyrics, search, playlists and the sleep timer, from any browser tab on the same computer. Every button is also an HTTP call for scripts and stream decks. Its ⚙ makes it your own: Noctorium's theme or the cover's colour, only the player, bigger lyrics, a name like “Living room”. It is off until you turn it on, and only this computer can reach it."
        />
        <Feature
          icon={<TriangleAlert className="size-5" />}
          title="Beta, and it says so"
          body="Every service but YouTube Music, YouTube and SoundCloud is in beta, and its settings say so above the sign-in: it may not work as it should, and there is a small chance it gets your account blocked. Use those at your own risk."
        />
        <Feature
          icon={<ListPlus className="size-5" />}
          title="Up next, from the same service"
          body="When the queue runs out, it carries on from the last song's own service: YouTube Music's radio, SoundCloud's related tracks, more from a Bandcamp artist, VK's suggestions, Spotify's own autoplay. See them coming, keep or drop any, switch autoplay on or off from the queue itself, and find the queue where you left it next time. A song picked on Home or from a search starts autoplay from it, and one button clears the queue down to the song playing."
        />
        <Feature
          icon={<MicVocal className="size-5" />}
          title="Lyrics that follow along"
          body="Synced lyrics from eight sources, with the line being sung lit up. Switch source right on the lyrics, and later songs open on your pick when it has them."
        />
        <Feature
          icon={<Lock className="size-5" />}
          title="Signing in, on their page"
          body="Your password goes to the service's own page — Google's, SoundCloud's, Spotify's, VK's, Apple's or Tidal's — never to a form of ours. Only the session is kept, on your device. Or sign the desktop in by scanning a code with your phone."
        />
        <Feature
          icon={<Palette className="size-5" />}
          title="Make it yours"
          body="Twenty-four themes, from Catppuccin and Nord to pure black crimson for OLED screens, and four Glow themes: near-black pages under a soft light, Afterglow's in the colour of the cover playing. Accent colours, six icon sets, each service's own logo on its badges or its letters if you prefer, liquid glass, twelve seek bars, twelve player bars and twelve layouts for now playing — a turntable, Cover flow, the title as a poster, a playlist table with a visualiser — with playback speed on a button of its own, a volume booster to 1000%, an equaliser, and Settings you can search."
        />
        <Feature
          icon={<Tv className="size-5" />}
          title="Stream widgets"
          body="On the desktop, show what is playing over your stream in OBS or Streamlabs: switch them on, copy a look's address into a Browser source, and the song, its cover and how far in it is appear on stream. Seven looks — Glass, Minimal, a turning Vinyl, Neon, a Ticker, a tall Afterglow card and a Windows 98 window — several at once if you like. Off until you switch them on."
        />
        <Feature
          icon={<AppWindow className="size-5" />}
          title="Windows 98 and XP, for real"
          body="Pick 98 and Noctorium becomes that desktop: grey bevelled buttons, navy title bars, scroll bars with arrows, and Now playing in windows on the teal desktop. Pick Noctorium 98 for the same 98 at night: violet title bars, black lists and a night sky behind the windows. Pick XP for Luna's blue, its task pane and the green start button. Each with a taskbar and a clock you can put away — on the computer, the phone, in a terminal and in the browser."
        />
        <Feature
          icon={<BatteryCharging className="size-5" />}
          title="Keeps playing"
          body="Close the window and the music carries on from the tray, or have Noctorium start with Windows. On the phone it plays on with the screen locked, even on phones that like to close apps, and a song that will not start after the phone has slept starts itself again where it was. Turn on Keep Noctorium alive and it stays running in the background, and comes back by itself when the phone stops it anyway, carrying on with the song where it was. If the phone restricts it in the background, so that switching apps would stop the music, Noctorium says so and takes you to the switch."
        />
        <Feature
          icon={<Download className="size-5" />}
          title="Offline, when you want it"
          body="Keep a song or a whole playlist to play without a connection. On the desktop they are saved as MP3s with their covers; on the phone, only over Wi-Fi if you like."
        />
        <Feature
          icon={<Table2 className="size-5" />}
          title="A player of the old school"
          body="Pick the Toolbar and the Playlist layout: play, pause and stop in a row of flat buttons, the cover docked beside the queue as a table with the columns you choose and the lyrics a tab away, a visualiser drawn from the sound itself, and a status bar with the stream's format. Or Toolbar 2: play and pause as one, and like, lyrics, the queue, the sleep timer, Connect and the speed in the row too — on the computer, the phone, in a terminal and in the browser."
        />
        <Feature
          icon={<Keyboard className="size-5" />}
          title="Ctrl+F, and keys of your own"
          body="On the desktop, a quick search over everything: type !ytm, !sc, !sp, !bc, !vk, !am, !dz or !td to search one service. Every shortcut can be changed, and global ones work from any program, Noctorium in the tray."
        />
        <Feature
          icon={<Volume2 className="size-5" />}
          title="Louder, up to 1000%"
          body="A volume booster behind the boost button that makes every song clearly louder at each step: quiet recordings close to ten times, music already mastered loud well past where it was. Your volume's room goes first, then a look-ahead limiter and a gentle clipper, so it gets loud rather than broken. Turned up, down or off, it changes the song already playing, straight away. The volume button shows the boost while it is on."
        />
        <Feature
          icon={<History className="size-5" />}
          title="A history that stays home"
          body="Every song you listen to, newest first and by day, on your profile on the computer and the phone, to play again or clear. It is kept on the device it was played on and sent nowhere, not even to your Noctorium account. Scrobble to Last.fm, Libre.fm and ListenBrainz if you like, with the sign-in link there to copy into any browser, and the desktop shows what you are playing on Discord."
        />
        <Feature
          icon={<KeyRound className="size-5" />}
          title="Sign in with Discord, Telegram or GitHub"
          body="Your Noctorium account, if you want one, opens with Discord, Telegram, GitHub or an email and password — link several to the same account. Telegram signs you in inside the Telegram app: press Start, then Confirm, with no phone number typed anywhere. Every Noctorium has it — the desktop, the phone, the TV, the terminal, Noctorium Lite, the iPhone and the web player: press Sign in, check the code and press Allow; on a TV or in a terminal, do it on your phone. Then what you play shows as your Discord status and in your Telegram bio, from any device, with no computer needed."
        />
        <Feature
          icon={<MonitorSmartphone className="size-5" />}
          title="Desktop and phone, together"
          body="Windows, macOS, Linux — Debian, Fedora, Arch, an AppImage or a Flatpak — and Android, built from one shared core so they behave the same rather than nearly the same. Connect has a tab of its own: every device on your network and what it is playing, and Play here or Play on any of them, at the same second with the whole queue. While the music plays elsewhere, your own player is its remote. A switch at the top of the tab turns Connect off, and then the device neither looks for your others nor can be seen."
        />
        <Feature
          icon={<Github className="size-5" />}
          title="Open, and yours"
          body="Every repository is public and the releases carry checksums. No telemetry and nothing to subscribe to; an account with us only if you want your listening counted."
        />
      </section>

      <SiteFooter />
    </main>
  );
}

/** Four ways in, the same library behind each. */
function Platforms() {
  return (
    <section className="pb-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">Wherever you listen</h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
        The same library, queue and likes on each — they all stand on one shared core.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Platform icon={<AppWindow className="size-5" />} title="Desktop" body="Windows, macOS and Linux, in a window of its own, in the tray or the menu bar when you close it." />
        <Platform icon={<Smartphone className="size-5" />} title="Phone" body="Android — and Android Auto and Android TV — with the lock screen, the notification, OnePlus's Live Alerts bubble and playing on with the screen off. Updates itself, or through Obtainium." />
        <Platform icon={<SquareTerminal className="size-5" />} title="Terminal" body="noctorium — the whole player in a terminal: covers, synced lyrics, every theme, by keyboard or mouse. It keeps itself up to date. Pick it in the installer or the one line above.">
          <code className="mt-3 block rounded-md bg-background/70 px-3 py-2 text-xs text-accent">noctorium play daft punk</code>
          <GetIt href="/download#cli" label="Get the CLI" />
        </Platform>
        <Platform icon={<Globe className="size-5" />} title="Browser" body="Open the web player and play — nothing to install, your likes and playlists kept in the browser, and your Noctorium account if you want your listening counted.">
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

/**
 * Android Auto and Android TV: the phone's own APK, which is Noctorium in the car and on a TV as well, from
 * Noctorium-Android-Auto and Noctorium-Android-TV built into Noctorium-Mobile.
 */
function CarAndTv() {
  return (
    <section id="car-and-tv" className="pb-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">In the car and on the TV</h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
        The Android app is Noctorium for Android Auto and Android TV too — one APK, the same library and queue.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Platform
          icon={<Car className="size-5" />}
          title="Android Auto"
          body="Home, your library, the queue, radio, search and voice — “play Daft Punk on Noctorium” — on the car's screen, with every cover. The car and the phone are one player: pick a song in one and it shows in the other."
        >
          <p className="mt-3 text-xs text-muted-foreground">
            Android Auto lists apps from outside Google Play once you turn on <em>Unknown sources</em>: in Android
            Auto&apos;s settings tap the version ten times, then find it under developer settings.
          </p>
        </Platform>
        <Platform
          icon={<Tv className="size-5" />}
          title="Android TV and Google TV"
          body="Noctorium on the TV's home screen, with pages made for the remote: Now playing large, Home's rows, Search, your Library, the queue and radio. Sign in once from its Settings, or let a phone on the same network play on it through Connect."
        />
      </div>
      <div className="mt-5 text-center">
        <GetIt href="/download#android" label="Get it for Android" />
      </div>
    </section>
  );
}

/**
 * What the optional account counts, and the two places to read it.
 *
 * The downloads are only listed once a release has them: a link to a file that is not there yet falls back to
 * the releases page, which would not have it either.
 */
function Stats() {
  return (
    <section className="pb-16">
      <div className="flex flex-col gap-5 rounded-xl border border-border/70 bg-card/50 p-6 text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:bg-card/80 sm:flex-row sm:p-8">
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent">
          <ChartColumn className="size-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Your listening, counted</h2>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed">
            Sign in to a Noctorium account, if you want one, and the player counts what you play on your computer and
            your phone. Read it on the statistics site, or in Noctorium Stats, an app of its own: the last week, month
            or year or all of it, your top songs and artists, how the services share your listening, the hours and
            days you listen most, and how many days in a row.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
            <a
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              href={STATS_SITE}
            >
              Open your statistics
            </a>
            <GetIt href="/download#stats" label="Get Noctorium Stats" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Noctorium Song Find, which says which song is playing. */
function SongFind() {
  return (
    <section className="pb-16">
      <div className="flex flex-col gap-5 rounded-xl border border-border/70 bg-card/50 p-6 text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:bg-card/80 sm:flex-row sm:p-8">
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent">
          <AudioLines className="size-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Which song is this?</h2>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed">
            Noctorium Song Find listens and tells you — through the microphone, for a song playing in the room, or
            straight from what your computer or phone is playing, with nothing held up to a speaker. It asks Shazam,
            AudD, ACRCloud and, on the desktop, AcoustID, links the song on Spotify, YouTube Music, Apple Music,
            Deezer and SoundCloud, and keeps a history of what it found on your device only. On the phone, the
            notifications follow along: a countdown while it listens, the seconds it has been looking, then found or
            not found. An app of its own for
            Windows, macOS, Linux and Android, and it updates itself like the rest of Noctorium.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
            <GetIt href="/download#song-find" label="Get Noctorium Song Find" />
          </div>
        </div>
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

/** The one download on the home page: every way to get Noctorium is on /download, sorted by device. */
function HeroDownload({ version }: { version?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/download"
          className="group inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Download className="size-5" />
          Download
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
        <a
          href={PLAYER}
          className="inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card/70 px-8 py-4 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card"
        >
          <Globe className="size-5" />
          Play in the browser
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        {version ? <>Version {version} · </> : null}Windows, macOS, Linux, Android and more
      </p>
    </div>
  );
}

/** A section's way to its own downloads, on /download. */
function GetIt({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent underline decoration-dotted underline-offset-4 transition hover:text-foreground">
      {label}
      <ArrowRight className="size-3.5" />
    </Link>
  );
}
