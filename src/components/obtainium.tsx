import Image from 'next/image';

/** An Obtainium link that adds the app with its APK filter already set, through Obtainium's own redirect page. */
export function obtainiumLink(id: string, name: string, apkFilterRegEx: string): string {
  const config = {
    id,
    url: 'https://github.com/Noctorium/Noctorium-Installer',
    author: 'Noctorium',
    name,
    additionalSettings: JSON.stringify({ apkFilterRegEx }),
  };
  return `https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/${encodeURIComponent(JSON.stringify(config))}`;
}

/**
 * Obtainium installs and updates Android apps from their releases. Every release carries all the APKs, so each
 * app is the same source with its own filter.
 */
export const OBTAINIUM_APPS = [
  { name: 'Noctorium', id: 'app.noctorium', filter: '^Noctorium-[0-9].*[.]apk$' },
  // The same app on a TV or in a car, each with its own APK since 0.38.0: one of these on that device, not the phone's.
  { name: 'Noctorium for TV', id: 'app.noctorium', filter: '^Noctorium-TV-[0-9].*[.]apk$' },
  { name: 'Noctorium for cars', id: 'app.noctorium', filter: '^Noctorium-Car-[0-9].*[.]apk$' },
  { name: 'Noctorium Lite', id: 'app.noctorium.lite', filter: '^Noctorium-Lite-[0-9].*[.]apk$' },
  { name: 'Noctorium Stats', id: 'app.noctorium.stats', filter: '^Noctorium-Stats-[0-9].*[.]apk$' },
  { name: 'Noctorium Song Find', id: 'app.noctorium.songfind', filter: '^Noctorium-Song-Find-[0-9].*[.]apk$' },
  { name: 'Noctorium Installer', id: 'app.noctorium.installer', filter: '^Noctorium-Installer-android[.]apk$' },
] as const;

/** The Obtainium buttons, for the apps a release has (Noctorium Lite only once it ships). */
export function ObtainiumButtons({ hasLite }: { hasLite: boolean }) {
  const apps = OBTAINIUM_APPS.filter((app) => hasLite || app.id !== 'app.noctorium.lite');
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {apps.map((app) => (
          <a
            key={app.name}
            href={obtainiumLink(app.id, app.name, app.filter)}
            className="flex flex-col items-start gap-2 rounded-lg border border-border/70 p-3 transition hover:border-primary/40"
          >
            <span className="text-sm font-semibold text-foreground">{app.name}</span>
            <Image src="/badge_obtainium.png" alt={`Get ${app.name} on Obtainium`} width={124} height={48} />
          </a>
        ))}
      </div>
      <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
        Or add it by hand: <strong className="text-foreground">Add app</strong>, the source{' '}
        <code className="break-all rounded bg-muted px-1 py-0.5 text-xs">https://github.com/Noctorium/Noctorium-Installer</code>,
        and under <em>Filter APKs by regular expression</em>{' '}
        {apps.map((app, i) => (
          <span key={app.name}>
            <code className="rounded bg-muted px-1 py-0.5 text-xs">{app.filter}</code> for {app.name}
            {i < apps.length - 1 ? (i === apps.length - 2 ? ' or ' : ', ') : '.'}
          </span>
        ))}{' '}
        Every APK is signed with Noctorium&apos;s key, and the filter picks the right one.
      </p>
    </>
  );
}
