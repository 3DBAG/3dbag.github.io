import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, Vector3, Color, BufferAttribute } from 'three';
import { SemanticStylingPlugin } from '../node_modules/3dtoml/src/utils/SemanticStylingPlugin.js';
import { heightStyle } from '../assets/js/home-map-style.js';
import { createNeighbourPreloader, nearBox, earthPoint } from '../assets/js/home-map-preload.js';
import { viewerUrl } from '../assets/js/home-map-link.js';
import config from '../data/home-map.json' with { type: 'json' };

test('height bands, missing data and explicit highlight precedence', () => {
  const plugin = new SemanticStylingPlugin({ THREE: { Color, BufferAttribute }, style: heightStyle(config) });
  const shade = (roof, ground = 0) => '#' + plugin._resolveColor({ b3_h_nok: roof, b3_h_maaiveld: ground }).getHexString();
  assert.equal(shade(7.9), '#d5c7e5');
  assert.equal(shade(8), '#bda4d5');
  assert.equal(shade(60), '#7b509c');
  // Category bounds come only from global configuration, with no scene extent.
  for (const [height, expected] of [[14.9, '#bda4d5'], [15, '#ab8bc5'], [39.9, '#9974b7'], [40, '#8a62ab']]) assert.equal(shade(height), expected);
  for (const value of [null, undefined, NaN, Infinity, 3.4028234663852886e38]) assert.equal(shade(value), config.buildingColor);
  // Equal above-ground heights retain the same category at different elevations.
  assert.equal(shade(112, 100), shade(12, 0));
  assert.equal(shade(7, -5), shade(12, 0));
  assert.equal(shade(115, 100), '#ab8bc5');
  for (const ground of [null, NaN, Infinity, 3.4028234663852886e38]) assert.equal(shade(20, ground), config.buildingColor);
  assert.equal('#' + plugin._resolveColor({ b3_h_nok: 20 }).getHexString(), config.buildingColor);
  assert.equal(shade(3.4028234663852886e38, 3.4028234663852886e38), config.buildingColor);
  assert.equal(shade(5, 10), config.buildingColor);
  plugin.style = heightStyle({ ...config, highlights: { ...config.highlights, values: ['example'] } });
  assert.equal('#' + plugin._resolveColor({ b3_h_nok: 65, identificatie: 'example' }).getHexString(), config.highlights.color);
});

test('prefetch box intersection respects transforms and rejects distant or unsupported bounds', () => {
  const box = [0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10];
  assert.equal(nearBox(box, new Matrix4(), new Vector3(12, 0, 0), 3), true);
  assert.equal(nearBox(box, new Matrix4(), new Vector3(14, 0, 0), 3), false);
  assert.equal(nearBox(box, new Matrix4().makeTranslation(100, 0, 0), new Vector3(100, 0, 0), 0), true);
  assert.equal(nearBox(null, new Matrix4(), new Vector3()), false);
});

test('neighbour bytes are reused by foreground loads; large files are skipped', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.document = { hidden: false };
  const center = earthPoint([4.37, 52]);
  const box = [...center.toArray(), 100, 0, 0, 0, 100, 0, 0, 0, 100];
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    if (String(url).endsWith('.json')) return Response.json({ root: { boundingVolume: { box }, children: [
      { boundingVolume: { box }, content: { uri: 'small.glb' } },
      { boundingVolume: { box }, content: { uri: 'large.glb' } }
    ] } });
    return new Response('tile bytes', { headers: { 'content-length': String(String(url).endsWith('large.glb') ? 9 * 1024 * 1024 : 10) } });
  };
  const preloader = createNeighbourPreloader('https://example.com/tileset.json');
  try {
    preloader.schedule([[4.37, 52]]);
    await new Promise(resolve => setTimeout(resolve, 1700));
    assert.equal(await (await preloader.fetchTiles('https://example.com/small.glb')).text(), 'tile bytes');
    assert.equal(calls.filter(url => url.endsWith('small.glb')).length, 1);
    await preloader.fetchTiles('https://example.com/large.glb');
    assert.equal(calls.filter(url => url.endsWith('large.glb')).length, 2);
    preloader.schedule([[4.37, 52]]);
    preloader.destroy();
  } finally {
    preloader.destroy();
    globalThis.fetch = originalFetch;
    delete globalThis.document;
  }
});


test('viewer links preserve camera coordinates, locale and layer choices', () => {
  const camera = { rdx: 182321.9105891861, rdy: 579518.1804248996, ox: -168.07778039106188, oy: 445.54644607167415, oz: 425.44782166599714 };
  const url = new URL(viewerUrl(camera, 'nl'));
  assert.equal(url.pathname, '/nl/viewer');
  assert.equal(url.searchParams.get('basemap'), 'openfreemap');
  assert.equal(url.searchParams.get('lod'), 'lod22');
  for (const key of Object.keys(camera)) assert.equal(Number(url.searchParams.get(key)), camera[key]);
  assert.equal(new URL(viewerUrl({ ...camera, ox: 123 }, 'en')).searchParams.get('ox'), '123');
  assert.equal(new URL(viewerUrl(camera)).pathname, '/en/viewer');
  assert.equal(viewerUrl({ ...camera, rdx: undefined }), null);
});
