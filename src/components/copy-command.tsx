'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** A command to paste into a terminal, with a button that puts it on the clipboard. */
export function CopyCommand({ label, command }: { label: string; command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card/60 py-1.5 pl-3 pr-1.5 text-left">
      <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1 text-xs text-accent sm:text-sm">{command}</code>
      <button
        type="button"
        aria-label={`Copy the ${label} command`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-primary/15 hover:text-foreground"
        onClick={() => {
          navigator.clipboard?.writeText(command).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        }}
      >
        {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
