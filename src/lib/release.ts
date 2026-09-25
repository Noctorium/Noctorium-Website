/**
 * What the latest release actually contains, asked of GitHub rather than written down here.
 *
 * A download page with a version typed into it is wrong the moment a release goes out, and nobody
 * notices until somebody downloads last month's build. The release repository is the same one the
 * applications check for updates, so the page and the player always agree.
 */

const RELEASE_API = 'https://api.github.com/repos/Noctorium/Noctorium-Installer/releases/latest';

export const RELEASES_PAGE = 'https://github.com/Noctorium/Noctorium-Installer/releases/latest';

export type Download = {
  name: string;
  url: string;
  /** Rounded to the nearest sensible unit; a download of this size deserves a warning. */
  size: string;
};

export type Release = {
  version: string;
  downloads: {
    windows?: Download;
    windowsMsi?: Download;
    android?: Download;
    debian?: Download;
    fedora?: Download;
  };
};

type Asset = { name: string; browser_download_url: string; size: number };

/**
 * Picks one asset per platform.
 *
 * Every rule here is a suffix, and deliberately so: a release carries both the player's APK and the
 * phone installer's, and a rule as loose as "ends with .apk" would offer whichever GitHub happened to
 * list first. The same shape of mistake as the `.exe` rules -- there are three of those in a release.
 */
function pick(assets: Asset[], matches: (lower: string) => boolean): Download | undefined {
  const found = assets.find((asset) => matches(asset.name.toLowerCase()));
  if (!found) return undefined;
  return { name: found.name, url: found.browser_download_url, size: readableSize(found.size) };
}

function readableSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${Math.round(bytes / 1_000_000)} MB`;
  return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
}

export async function latestRelease(): Promise<Release | null> {
  try {
    const reply = await fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      // Long enough that a burst of visitors is one request, short enough that a release shows up the
      // same hour it is published.
      next: { revalidate: 900 },
    });
    if (!reply.ok) return null;
    const body = (await reply.json()) as { tag_name?: string; assets?: Asset[] };
    const assets = body.assets ?? [];
    return {
      version: (body.tag_name ?? '').replace(/^v/, ''),
      downloads: {
        windows: pick(assets, (n) => n.endsWith('-setup.exe') && !n.includes('installer')),
        windowsMsi: pick(assets, (n) => n.endsWith('.msi')),
        android: pick(assets, (n) => n.endsWith('.apk') && !n.includes('installer')),
        debian: pick(assets, (n) => n.endsWith('.deb')),
        fedora: pick(assets, (n) => n.endsWith('.rpm')),
      },
    };
  } catch {
    // The page is worth showing without it; the buttons fall back to the releases page.
    return null;
  }
}
