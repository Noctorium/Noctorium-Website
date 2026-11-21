import type { Metadata } from 'next';
import Image from 'next/image';
import { Crown, HeartHandshake } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Supporters — Noctorium',
  description: 'The people who help keep Noctorium going.',
};

/** The people behind Noctorium. Each picture opens their own page. */
const MVP = {
  name: 'aquamarine hoshino',
  picture: '/supporters/aquamarine-hoshino.jpg',
  link: 'https://akumarin.nekoweb.org',
};

export default function SupportersPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <SiteHeader />

      <section className="flex flex-col items-center pb-16 pt-6 text-center sm:pt-10">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-accent">
          <HeartHandshake className="size-6" />
        </div>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Supporters</h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          The people who help keep Noctorium going. Thank you.
        </p>
      </section>

      <section className="flex flex-col items-center pb-20">
        <div className="relative flex flex-col items-center rounded-3xl border border-primary/40 bg-card/60 px-10 pb-8 pt-10 text-center shadow-2xl shadow-primary/10 backdrop-blur">
          <span className="absolute -top-3.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30">
            <Crown className="size-3.5" /> MVP
          </span>
          <a
            href={MVP.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${MVP.name}'s page`}
            className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <div aria-hidden className="absolute inset-0 -z-10 animate-breathe rounded-full bg-primary/40 blur-2xl" />
            <Image
              src={MVP.picture}
              alt={MVP.name}
              width={160}
              height={160}
              className="size-40 rounded-full object-cover ring-4 ring-primary/60 transition group-hover:scale-105 group-hover:ring-primary"
              priority
            />
          </a>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">{MVP.name}</h2>
          <p className="mt-1 text-sm font-medium text-foreground/80">Bought the domain</p>
          <a href={MVP.link} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-accent underline decoration-dotted underline-offset-4 hover:text-foreground">
            akumarin.nekoweb.org
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
