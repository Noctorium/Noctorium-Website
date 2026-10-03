import type { ReactNode } from 'react';

/**
 * The release notes, as the page shows them.
 *
 * Every release's notes are written in Noctorium-Installer's `notes/` in the same small shape -- a one-line
 * summary, `##` headings, bullets that run over several lines, bold, inline code, links, a fenced command --
 * and that shape is all this reads. It builds React elements rather than HTML, so nothing in a release's
 * text is ever put on the page as markup, and a construct it does not know simply reads as text.
 */

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'code'; text: string };

/** The notes split into their summary -- the first paragraph -- and everything after it. */
export function splitNotes(body: string): { summary: string; blocks: Block[] } {
  const blocks = parse(body);
  const first = blocks[0];
  if (first?.kind === 'paragraph') return { summary: first.text, blocks: blocks.slice(1) };
  return { summary: '', blocks };
}

function parse(body: string): Block[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
    if (list) blocks.push({ kind: 'list', items: list });
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      flush();
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].trim().startsWith('```'); i++) code.push(lines[i]);
      blocks.push({ kind: 'code', text: code.join('\n') });
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      flush();
      blocks.push({ kind: 'heading', text: line.replace(/^#{1,4}\s+/, '') });
      continue;
    }
    if (/^\s*[-*]\s/.test(line)) {
      if (paragraph.length) {
        blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
        paragraph = [];
      }
      list ??= [];
      list.push(line.replace(/^\s*[-*]\s+/, ''));
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    // A line indented under a bullet carries on that bullet; anything else is a paragraph.
    if (list && /^\s{2,}/.test(line)) {
      list[list.length - 1] += ' ' + line.trim();
      continue;
    }
    if (list) {
      blocks.push({ kind: 'list', items: list });
      list = null;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

/** Bold, inline code and links within one line; everything else as it is. */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="rounded bg-background/70 px-1.5 py-0.5 text-[0.85em] text-accent">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      // Only a web address is ever made a link.
      if (!/^https?:\/\//.test(link[2])) return link[1];
      return (
        <a key={i} href={link[2]} className="text-foreground underline decoration-dotted underline-offset-4 hover:text-accent">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export function NoteBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return <h4 key={i} className="pt-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">{block.text}</h4>;
          case 'paragraph':
            return <p key={i} className="text-pretty">{inline(block.text)}</p>;
          case 'list':
            return (
              <ul key={i} className="list-disc space-y-2 pl-5 marker:text-primary/70">
                {block.items.map((item, j) => <li key={j} className="text-pretty">{inline(item)}</li>)}
              </ul>
            );
          case 'code':
            return (
              <pre key={i} className="overflow-x-auto rounded-md bg-background/70 px-3 py-2 text-xs text-accent">
                <code>{block.text}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}
