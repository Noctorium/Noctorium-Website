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
  };
  /** Noctorium in a terminal, and `noctorium web` for the browsers in the house. */
  cli: {
    windows?: Download;
    linux?: Download;
  };
};

type Asset = { name: string; browser_download_url: string; size: number };

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
    return {
      version: (body.tag_name ?? '').replace(/^v/, ''),
      installers: {
        windows: pick(assets, (n) => installer(n) && !terminal(n) && n.endsWith('.exe')),
        linux: pick(assets, (n) => installer(n) && !terminal(n) && n.endsWith('linux-x64')),
        linuxAppImage: pick(assets, (n) => installer(n) && n.endsWith('.appimage')),
        android: pick(assets, (n) => installer(n) && n.endsWith('.apk')),
        windowsCli: pick(assets, (n) => terminal(n) && n.endsWith('.exe')),
        linuxCli: pick(assets, (n) => terminal(n) && n.endsWith('linux-x64')),
      },
      direct: {
        windows: pick(assets, (n) => !installer(n) && n.endsWith('-setup.exe')),
        windowsMsi: pick(assets, (n) => n.endsWith('.msi')),
        android: pick(assets, (n) => !installer(n) && n.endsWith('.apk')),
        debian: pick(assets, (n) => n.endsWith('.deb')),
        fedora: pick(assets, (n) => n.endsWith('.rpm')),
        arch: pick(assets, (n) => n.endsWith('.pkg.tar.zst')),
        appImage: pick(assets, (n) => !installer(n) && n.endsWith('.appimage')),
        flatpak: pick(assets, (n) => n.endsWith('.flatpak')),
      },
      cli: {
        windows: pick(assets, (n) => player(n) && n.endsWith('windows-x64.zip')),
        linux: pick(assets, (n) => player(n) && n.endsWith('linux-x64.tar.gz')),
      },
    };
  } catch {
    // The page is worth showing without it; the buttons fall back to the releases page.
    return null;
  }
}
