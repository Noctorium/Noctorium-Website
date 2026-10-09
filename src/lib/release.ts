/**
 * What the latest release actually contains, asked of GitHub rather than written down here.
 *
 * A download page with a version typed into it is wrong the moment a release goes out, and nobody
 * notices until somebody downloads last month's build. The release repository is the same one the
 * applications check for updates, so the page and the player always agree.
 */

const RELEASE_API = 'https://api.github.com/repos/Noctorium/Noctorium-Installer/releases/latest';

/** The hosted web player, which needs nothing installed. */
export const PLAYER = 'https://noctorium-music.vercel.app';

export const RELEASES_PAGE = 'https://github.com/Noctorium/Noctorium-Installer/releases/latest';

export type Download = {
  name: string;
  url: string;
  /** Rounded to the nearest sensible unit; some of these are hundreds of megabytes. */
  size: string;
};

export type Release = {
  version: string;
  /**
   * The small programs that fetch the rest: `pc/` in Rust, `phone/` in Dart with Flutter.
   *
   * What somebody downloads once. Each asks GitHub for the current release, checks what it fetched
   * against the checksum published beside it, and hands it to Windows, to apt or dnf, or to Android's
   * own package installer. Everything after that is the application's own updater.
   */
  installers: {
    windows?: Download;
    linux?: Download;
    linuxAppImage?: Download;
    android?: Download;
    /** The same installers, in a terminal. */
    windowsCli?: Download;
    linuxCli?: Download;
    /** One program for both kinds of Mac. */
    macCli?: Download;
  };
  /** The application itself, for somebody who would rather have the file than a program that fetches it. */
  direct: {
    windows?: Download;
    windowsMsi?: Download;
    android?: Download;
    debian?: Download;
    fedora?: Download;
    arch?: Download;
    appImage?: Download;
    flatpak?: Download;
    /** The Mac's disk images: Apple silicon, and Intel. */
    macArm?: Download;
    macIntel?: Download;
  };
  /** Noctorium in a terminal, and `noctorium web` for the browsers in the house. */
  cli: {
    windows?: Download;
    linux?: Download;
    macArm?: Download;
    macIntel?: Download;
  };
  /** Noctorium Stats: what the Noctorium account counts, in an app of its own. Missing before 0.13.0. */
  stats: {
    windows?: Download;
    linux?: Download;
    macArm?: Download;
    macIntel?: Download;
    android?: Download;
  };
};

type Asset = { name: string; browser_download_url: string; size: number };

/** One published release's notes, for What's new. */
export type ReleaseNote = {
  version: string;
  /** When it was published, written out: "3 October 2026". */
  date: string;
  /** The notes as written in Noctorium-Installer's notes/, which is what each release is published with. */
  body: string;
  url: string;
};

export const NOTES_PAGE = 'https://github.com/Noctorium/Noctorium-Installer/tree/main/notes';

/** Noctorium's Telegram channel, where news of each release goes out. */
export const TELEGRAM = 'https://t.me/noctoriumismusic';

/**
 * The last few published releases' notes, newest first.
 *
 * Asked of the same API as the downloads and on the same fifteen-minute clock, so What's new changes the
 * hour a release goes out, with nothing to edit here. Drafts and pre-releases are left out: a draft is a
 * release not yet made, and the page only speaks of ones people can download.
 */
export async function recentReleases(count = 3): Promise<ReleaseNote[]> {
  try {
    const reply = await fetch(`${RELEASE_API.replace(/\/latest$/, '')}?per_page=${count + 3}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'noctorium-website' },
      next: { revalidate: 900 },
    });
    if (!reply.ok) {
      console.error(`Noctorium: GitHub answered ${reply.status} for the release list`);
      return [];
    }
    const releases = (await reply.json()) as {
      tag_name?: string;
      body?: string;
      html_url?: string;
      published_at?: string;
      draft?: boolean;
      prerelease?: boolean;
    }[];
    return releases
      .filter((r) => !r.draft && !r.prerelease && r.tag_name && r.body?.trim())
      .slice(0, count)
      .map((r) => ({
        version: r.tag_name!.replace(/^v/, ''),
        date: r.published_at
          ? new Date(r.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
          : '',
        body: r.body!,
        url: r.html_url ?? RELEASES_PAGE,
      }));
  } catch {
    return [];
  }
}

/**
 * Picks one asset by name.
 *
 * Every rule is a suffix plus, where it matters, whether the name says "installer". A release carries two
 * `.apk` files -- the player's and the phone installer's -- and three `.exe` files, so a rule as loose as
 * "ends with .apk" offers whichever GitHub happened to list first, which is right about half the time.
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
      headers: {
        Accept: 'application/vnd.github+json',
        /*
         * Required, and the whole page quietly depends on it.
         *
         * GitHub answers an API request with no User-Agent `403 Request forbidden by administrative
         * rules`, and `fetch` does not always supply one. The page caught it and fell back to a bare link
         * to the releases page -- which looks like a design choice rather than a failure, so it sat there
         * through a release without anybody noticing. Hence the header, and the complaint below.
         */
        'User-Agent': 'noctorium-website',
      },
      // Long enough that a burst of visitors is one request, short enough that a release shows up the
      // same hour it is published.
      next: { revalidate: 900 },
    });
    if (!reply.ok) {
      // Into the build or function log, because the page itself cannot say this without becoming an
      // error page over something that is only a stale download link.
      console.error(`Noctorium: GitHub answered ${reply.status} for the latest release`);
      return null;
    }
    const body = (await reply.json()) as { tag_name?: string; assets?: Asset[] };
    const assets = body.assets ?? [];
    const installer = (n: string) => n.includes('installer');
    // The terminal installers carry "installer-cli"; the window ones only "installer".
    const terminal = (n: string) => n.includes('installer-cli');
    const player = (n: string) => n.startsWith('noctorium-cli-');
    // Noctorium Stats brings a second .apk that is not an installer, so the player's needs telling apart.
    const stats = (n: string) => n.startsWith('noctorium-stats-');
    return {
      version: (body.tag_name ?? '').replace(/^v/, ''),
      installers: {
        windows: pick(assets, (n) => installer(n) && !terminal(n) && n.endsWith('.exe')),
        linux: pick(assets, (n) => installer(n) && !terminal(n) && n.endsWith('linux-x64')),
        linuxAppImage: pick(assets, (n) => installer(n) && n.endsWith('.appimage')),
        android: pick(assets, (n) => installer(n) && n.endsWith('.apk')),
        windowsCli: pick(assets, (n) => terminal(n) && n.endsWith('.exe')),
        linuxCli: pick(assets, (n) => terminal(n) && n.endsWith('linux-x64')),
        macCli: pick(assets, (n) => terminal(n) && n.endsWith('-macos')),
      },
      direct: {
        windows: pick(assets, (n) => !installer(n) && n.endsWith('-setup.exe')),
        windowsMsi: pick(assets, (n) => n.endsWith('.msi')),
        android: pick(assets, (n) => !installer(n) && !stats(n) && n.endsWith('.apk')),
        debian: pick(assets, (n) => n.endsWith('.deb')),
        fedora: pick(assets, (n) => n.endsWith('.rpm')),
        arch: pick(assets, (n) => n.endsWith('.pkg.tar.zst')),
        appImage: pick(assets, (n) => !installer(n) && n.endsWith('.appimage')),
        flatpak: pick(assets, (n) => n.endsWith('.flatpak')),
        macArm: pick(assets, (n) => n.endsWith('-macos-arm64.dmg')),
        macIntel: pick(assets, (n) => n.endsWith('-macos-x64.dmg')),
      },
      cli: {
        windows: pick(assets, (n) => player(n) && n.endsWith('windows-x64.zip')),
        linux: pick(assets, (n) => player(n) && n.endsWith('linux-x64.tar.gz')),
        macArm: pick(assets, (n) => player(n) && n.endsWith('macos-arm64.tar.gz')),
        macIntel: pick(assets, (n) => player(n) && n.endsWith('macos-x64.tar.gz')),
      },
      stats: {
        windows: pick(assets, (n) => stats(n) && n.endsWith('windows-x64.zip')),
        linux: pick(assets, (n) => stats(n) && n.endsWith('linux-x64.tar.gz')),
        macArm: pick(assets, (n) => stats(n) && n.endsWith('macos-arm64.zip')),
        macIntel: pick(assets, (n) => stats(n) && n.endsWith('macos-x64.zip')),
        android: pick(assets, (n) => stats(n) && n.endsWith('.apk')),
      },
    };
  } catch {
    // The page is worth showing without it; the buttons fall back to the releases page.
    return null;
  }
}
