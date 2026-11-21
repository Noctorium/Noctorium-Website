'use client';

import { useEffect, useState } from 'react';
import { Apple, AppWindow, ChevronDown, Download as DownloadIcon, Globe, Smartphone, SquareTerminal, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Download } from '@/lib/release';

export type PlatformId = 'windows' | 'macos' | 'linux' | 'android' | 'iphone' | 'browser' | 'terminal';

/** One system's downloads, worked out on the server from the latest release and handed over as plain data. */
export type Platform = {
  id: PlatformId;
  label: string;
  /** What the big button says, and what it downloads (or opens). */
  action: string;
  href: string;
  size?: string;
  /** Two sentences at most: what this gets you, and anything to know first. */
  note: string;
  files: { label: string; file: Download }[];
};

const ICONS: Record<PlatformId, React.ComponentType<{ className?: string }>> = {
  windows: AppWindow,
  macos: Apple,
  linux: Terminal,
  android: Smartphone,
  iphone: Apple,
  browser: Globe,
  terminal: SquareTerminal,
};

/** Which system this browser is on, from what it says about itself. Null when it does not say anything useful. */
function detect(available: PlatformId[]): PlatformId | null {
  if (typeof navigator === 'undefined') return null;
  const agent = navigator.userAgent;
  // An iPad asks for the desktop site and calls itself a Mac; its touch screen gives it away.
  const touchMac = /Macintosh/.test(agent) && navigator.maxTouchPoints > 1;
  const found: PlatformId | null = /iPhone|iPad|iPod/.test(agent) || touchMac ? 'iphone'
    : /Android/.test(agent) ? 'android'
      : /Windows/.test(agent) ? 'windows'
        : /Macintosh|Mac OS X/.test(agent) ? 'macos'
          : /Linux|X11|CrOS/.test(agent) ? 'linux'
            : null;
  if (found && available.includes(found)) return found;
  // No iPhone build in this release: the browser is what an iPhone can use.
  return found === 'iphone' ? 'browser' : null;
}

/**
 * The download page's one decision: which system. The browser's own is chosen to begin with and offered as one big
 * button; the tabs show any other, one at a time, with its other files folded away underneath.
 */
export function DownloadPicker({ platforms, extras }: { platforms: Platform[]; extras: Partial<Record<PlatformId, React.ReactNode>> }) {
  const [selected, setSelected] = useState<PlatformId>(platforms[0].id);
  const [detected, setDetected] = useState<PlatformId | null>(null);

  useEffect(() => {
    const ids = platforms.map((p) => p.id);
    const fromLink = window.location.hash.slice(1) as PlatformId;
    const mine = detect(ids);
    setDetected(mine);
    if (ids.includes(fromLink)) setSelected(fromLink);
    else if (mine) setSelected(mine);
  }, [platforms]);

  // On a phone the tabs scroll sideways: keep the chosen one in sight.
  useEffect(() => {
    document.querySelector(`[data-platform="${selected}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [selected]);

  const choose = (id: PlatformId) => {
    setSelected(id);
    history.replaceState(null, '', `#${id}`);
  };

  const platform = platforms.find((p) => p.id === selected) ?? platforms[0];
  const Icon = ICONS[platform.id];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div role="tablist" aria-label="Your system" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {platforms.map((p) => {
          const TabIcon = ICONS[p.id];
          return (
            <button
              key={p.id}
              data-platform={p.id}
              role="tab"
              type="button"
              aria-selected={p.id === selected}
              onClick={() => choose(p.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                p.id === selected
                  ? 'border-primary/60 bg-primary/15 text-foreground'
                  : 'border-border/70 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <TabIcon className="size-4" />
              {p.label}
              {p.id === detected && <span className="rounded-full bg-primary/25 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent">You</span>}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-6 rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-accent">
            <Icon className="size-7" />
          </div>
          <a
            href={platform.href}
            className="mt-5 inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            {platform.id === 'browser' ? <Globe className="size-5" /> : <DownloadIcon className="size-5" />}
            {platform.action}
            {platform.size && <span className="text-sm font-normal opacity-75">{platform.size}</span>}
          </a>
          <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">{platform.note}</p>
        </div>

        {extras[platform.id] && <div className="mt-6">{extras[platform.id]}</div>}

        {platform.files.length > 0 && (
          <details className="group mt-6 rounded-xl border border-border/60 bg-background/40">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground [&::-webkit-details-marker]:hidden">
              Other files for {platform.label}
              <ChevronDown className="size-4 transition group-open:rotate-180" />
            </summary>
            <div className="divide-y divide-border/50 border-t border-border/50">
              {platform.files.map(({ label, file }) => (
                <a key={label} href={file.url} className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-primary/5 hover:text-foreground">
                  <span>{label}</span>
                  <span className="shrink-0 text-xs opacity-60">{file.size}</span>
                </a>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
