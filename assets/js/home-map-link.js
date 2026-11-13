export function viewerUrl(camera, locale = 'en') {
  const url = new URL(`https://3dbag.nl/${locale === 'nl' ? 'nl' : 'en'}/viewer`);
  url.searchParams.set('basemap', 'openfreemap');
  url.searchParams.set('lod', 'lod22');
  for (const key of ['rdx', 'rdy', 'ox', 'oy', 'oz']) {
    const value = Number(camera[key]);
    if (camera[key] == null || !Number.isFinite(value)) return null;
    url.searchParams.set(key, String(value));
  }
  return url.href;
}
