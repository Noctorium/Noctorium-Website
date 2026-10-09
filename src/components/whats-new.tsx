import { ChevronDown, Sparkles } from 'lucide-react';
import { NoteBlocks, splitNotes } from '@/lib/notes';
import { NOTES_PAGE, TELEGRAM, type ReleaseNote } from '@/lib/release';

/**
 * What changed lately, straight from the release notes.
 *
 * The newest release is shown whole; the two before it fold away under their one-line summaries, because a
 * small fix on top of a large release should not hide the large release from somebody who missed it. Nothing
 * here is written for the page: each release is published with its notes, and those are what is shown.
 */
export function WhatsNew({ releases }: { releases: ReleaseNote[] }) {
  if (!releases.length) return null;
  const [latest, ...earlier] = releases;
  const newest = splitNotes(latest.body);

  return (
    <section id="whats-new" className="scroll-mt-8 pb-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">What&apos;s new</h2>
      <p className="mx-auto mb-8 max-w-xl text-center text-muted-foreground">
        From the release notes, as each version comes out. To hear about the next one,{' '}
        <a href={TELEGRAM} className="text-accent underline decoration-dotted underline-offset-4 hover:text-foreground">
          follow Noctorium on Telegram
        </a>
        .
      </p>

      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <article className="rounded-xl border border-primary/40 bg-card/60 p-6 backdrop-blur">
          <header className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
              <Sparkles className="size-3.5" /> Latest
            </span>
            <a href={latest.url} className="text-lg font-semibold text-foreground hover:text-accent">
              Noctorium {latest.version}
            </a>
            {latest.date && <span className="text-sm text-muted-foreground">{latest.date}</span>}
          </header>
          {newest.summary && <p className="mb-4 text-pretty text-foreground/90">{newest.summary}</p>}
          <NoteBlocks blocks={newest.blocks} />
        </article>

        {earlier.map((release) => {
          const notes = splitNotes(release.body);
          return (
            <details key={release.version} className="group rounded-xl border border-border/70 bg-card/40 backdrop-blur">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold text-foreground">Noctorium {release.version}</span>
                {release.date && <span className="text-sm text-muted-foreground">{release.date}</span>}
                <span className="hidden min-w-0 flex-1 truncate text-sm text-muted-foreground sm:block">{notes.summary}</span>
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">
                {notes.summary && <p className="mb-4 text-pretty text-foreground/90 sm:hidden">{notes.summary}</p>}
                <NoteBlocks blocks={notes.blocks} />
              </div>
            </details>
          );
        })}

        <a href={NOTES_PAGE} className="mt-1 text-center text-sm text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground">
          Every release&apos;s notes
        </a>
      </div>
    </section>
  );
}
