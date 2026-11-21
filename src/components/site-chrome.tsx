import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, MessagesSquare, Send } from 'lucide-react';
import { TELEGRAM } from '@/lib/release';

export const GITHUB = 'https://github.com/Noctorium';

/** Noctorium's Discord: where problems are reported and ideas suggested. */
export const DISCORD = 'https://discord.gg/TfePG6mzhM';

const navLink = 'inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground';

/** The bar along the top of every page: the name, home, and where to get it and talk about it. */
export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 py-6">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <Image src="/noctorium.png" alt="" width={28} height={28} className="rounded-md" priority />
        <span className="font-semibold tracking-tight">Noctorium</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-5">
        {/* Named even on a phone: a speech bubble or a paper plane alone does not say which. On the narrowest,
            the names stay and the pictures go. */}
        <Link href="/download" className={`${navLink} font-medium text-foreground`}>
          <Download className="hidden size-4 min-[360px]:block" />
          <span>Download</span>
        </Link>
        <a href={DISCORD} className={navLink}>
          <MessagesSquare className="hidden size-4 sm:block" />
          <span>Discord</span>
        </a>
        <a href={TELEGRAM} className={`${navLink} hidden min-[400px]:inline-flex`}>
          <Send className="hidden size-4 sm:block" />
          <span>Telegram</span>
        </a>
        <a href={GITHUB} aria-label="Source" className={`${navLink} hidden sm:inline-flex`}>
          <Github className="size-4" />
          <span className="hidden md:inline">Source</span>
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const link = 'text-accent underline decoration-dotted underline-offset-4 transition hover:text-foreground';
  return (
    <footer className="mt-auto flex flex-col items-center gap-2 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
      <p>
        Noctorium plays from YouTube Music, SoundCloud, Bandcamp, Spotify, VK Music, Apple Music, Deezer and Tidal
        using your own accounts. It is not affiliated with any of them.
      </p>
      <p>
        Something not working, or an idea? <a href={DISCORD} className={link}>Tell us on Discord</a>. News of each
        release goes out on <a href={TELEGRAM} className={link}>Telegram</a>.
      </p>
      <p className="flex gap-4">
        <Link href="/supporters" className="transition hover:text-foreground">Supporters</Link>
        <a href={GITHUB} className="transition hover:text-foreground">github.com/Noctorium</a>
      </p>
    </footer>
  );
}
