import Image from 'next/image';
import { Github, Heart, ListMusic, Lock, MonitorSmartphone, Radio } from 'lucide-react';
import { DownloadButtons } from '@/components/download-buttons';
import { latestRelease } from '@/lib/release';

const GITHUB = 'https://github.com/Noctorium';

export default async function Home() {
  const release = await latestRelease();

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
          YouTube Music and SoundCloud, in one library, on your desktop and your phone. Your own accounts —
          your likes and playlists are written to them, not kept in a copy here.
        </p>

        <div className="mt-11 w-full animate-rise" style={{ animationDelay: '180ms' }}>
          <DownloadButtons release={release} />
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-2">
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
          body="Make one on either account, add tracks to it, rename it, change who can see it, delete it. Private by default — a playlist made in one tap is not one you meant to publish."
        />
        <Feature
          icon={<Lock className="size-5" />}
          title="Signing in, on their page"
          body="Your password goes to Google's or SoundCloud's own page, shown inside Noctorium, never to a form of ours. Only the session is kept, and it stays on your machine."
        />
        <Feature
          icon={<MonitorSmartphone className="size-5" />}
          title="Desktop and phone"
          body="Windows, Debian and Fedora builds, and an Android app. Both are built from one shared core, so the two behave the same rather than nearly the same."
        />
        <Feature
          icon={<Github className="size-5" />}
          title="Open, and yours"
          body="Every repository is public and the releases carry checksums. No account with us, no telemetry, nothing to subscribe to."
        />
      </section>

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
