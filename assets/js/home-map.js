import { MapTilesViewer, rdToCartographic } from '3dtoml';
const config = JSON.parse(document.getElementById('home-map-config').textContent);
import { heightStyle } from './home-map-style.js';
import { viewerUrl } from './home-map-link.js';
import { configureBuildingLighting } from './home-map-lighting.js';
import { createNeighbourPreloader } from './home-map-preload.js';

class HomepageViewer extends MapTilesViewer {
  getActiveColormapStyle() { return heightStyle(config); }
  onThreeLayerAdd(map, gl) {
    super.onThreeLayerAdd(map, gl);
    if (!this.homepageLighting) {
      configureBuildingLighting(this);
      this.homepageLighting = true;
    }
  }
  createFeatureMaterial(object) {
    const material = super.createFeatureMaterial(object);
    material.flatShading = true;
    return material;
  }
}
const preloader = createNeighbourPreloader(config.tilesUrl);

const figure = document.querySelector('[data-home-map]');
const container = figure.querySelector('.hero-map-canvas');
const status = figure.querySelector('[data-map-status]');
const caption = figure.querySelector('[data-map-location]');
const buttons = [...figure.querySelectorAll('[data-map-step]')];
const openMapLink = document.querySelector('[data-open-map]');
const nl = document.documentElement.lang.startsWith('nl');
let viewer;
let index = 0;
let ready = false;

function camera(location) {
  const { lon, lat } = rdToCartographic(Number(location.rdx), Number(location.rdy));
  return {
    center: [lon * 180 / Math.PI, lat * 180 / Math.PI],
    zoom: config.zoom,
    pitch: config.pitch,
    bearing: Math.atan2(-Number(location.ox), Number(location.oz)) * 180 / Math.PI
  };
}

// Preserve OpenFreeMap geometry and source attribution; simplify its presentation.
function purpleStyle(style) {
  style.layers = style.layers.filter(layer =>
    !['symbol', 'fill-extrusion'].includes(layer.type) &&
    !layer.id.toLowerCase().includes('building'));
  for (const layer of style.layers) {
    const water = /water/.test(layer.id);
    const green = /park|landcover|landuse/.test(layer.id);
    const paint = layer.paint ||= {};
    if (layer.type === 'background') paint['background-color'] = '#eee9f3';
    if (layer.type === 'fill') {
      paint['fill-color'] = water ? '#c9bddb' : green ? '#e0d7ea' : '#eae3f0';
      if ('fill-outline-color' in paint) paint['fill-outline-color'] = '#d3c7df';
      delete paint['fill-pattern'];
    }
    if (layer.type === 'line') {
      paint['line-color'] = water ? '#c9bddb' : /boundary/.test(layer.id) ? '#c8b8d8' : '#faf7fc';
      delete paint['line-pattern'];
    }
  }
  return style;
}

function updateViewLink(position) {
  const href = viewerUrl(position, nl ? 'nl' : 'en');
  if (href) openMapLink.href = href;
}

function showLocation() {
  updateViewLink(config.locations[index]);
  caption.textContent = `${config.locations[index].name} · ${index + 1} / ${config.locations.length}`;
}

function preloadNeighbours() {
  const count = config.locations.length;
  preloader.schedule([1, -1].map(step => camera(config.locations[(index + step + count) % count]).center),
    () => Boolean(viewer.tiles?.stats.downloading || viewer.tiles?.stats.parsing));
}

function fail() {
  status.hidden = false;
  status.textContent = nl ? 'De kaart is momenteel niet beschikbaar. Bekijk 3DBAG via de link hierboven.' : 'The map is currently unavailable. Explore 3DBAG using the link above.';
}

async function start() {
  const timeout = setTimeout(fail, 30000);
  try {
    const response = await fetch('https://tiles.openfreemap.org/styles/liberty', { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Basemap: ${response.status}`);
    const style = purpleStyle(await response.json());
    viewer = new HomepageViewer(container, {
      tilesUrl: config.tilesUrl,
      fetchTiles: preloader.fetchTiles,
      basemapStyles: { openfreemap: style },
      initialCamera: config.locations[0],
      constrainToTileset: false,
      showTilesetBoundary: false,
      enablePicking: false,
      showTerrain: true,
      showHillshade: true,
      config: { terrainTileJsonUrl: config.terrainTileJsonUrl, terrainEncoding: config.terrainEncoding },
      locale: nl ? 'nl' : 'en',
      attribution: '<a href="https://3dbag.nl/">3DBAG</a>',
      colormap: {
        attribute: config.heightColors.attribute,
        values: [],
        other: config.buildingColor
      }
    });
    const map = viewer.map;
    map.on('style.load', () => {
      for (const layer of map.getStyle().layers.filter(layer => layer.type === 'hillshade')) {
        map.setPaintProperty(layer.id, 'hillshade-shadow-color', '#766089');
        map.setPaintProperty(layer.id, 'hillshade-highlight-color', '#faf7fc');
        map.setPaintProperty(layer.id, 'hillshade-accent-color', '#a18ab8');
      }
    });
    // A narrow perspective keeps the basemap, terrain and tiles on one shared
    // projection while approaching an orthographic architectural view.
    map.setVerticalFieldOfView(config.fieldOfView);
    // Keep page scrolling available. Use primary-button dragging to orbit the
    // centre, without relying on MapLibre's private mouse-handler internals.
    for (const handler of ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate', 'touchPitch']) map[handler]?.disable();
    const canvas = map.getCanvas();
    canvas.setAttribute('tabindex', '-1');
    let drag = null;
    canvas.addEventListener('pointerdown', event => {
      if (!ready || event.pointerType !== 'mouse' || event.button !== 0) return;
      event.preventDefault();
      map.stop();
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, bearing: map.getBearing(), pitch: map.getPitch() };
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('is-rotating');
    });
    canvas.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      map.jumpTo({
        bearing: drag.bearing + (event.clientX - drag.x) * 0.35,
        pitch: Math.max(20, Math.min(70, drag.pitch - (event.clientY - drag.y) * 0.25))
      });
    });
    const endDrag = event => {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      canvas.classList.remove('is-rotating');
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);
    viewer.on('camera-change', position => {
      updateViewLink(position);
      if (ready) return;
      ready = true;
      clearTimeout(timeout);
      map.jumpTo(camera(config.locations[0]));
      status.hidden = true;
      buttons.forEach(button => { button.disabled = false; });
      preloadNeighbours();
    });
    // Refresh immediately before following the link, including when clicked
    // just after a drag and before the debounced camera-change event.
    openMapLink.addEventListener('click', () => viewer.emitCameraPosition());
    viewer.on('tiles-error', error => { if (error) fail(); else if (ready) status.hidden = true; });
    container.addEventListener('webglcontextlost', fail);
    for (const button of buttons) button.addEventListener('click', () => {
      index = (index + Number(button.dataset.mapStep) + config.locations.length) % config.locations.length;
      showLocation();
      map.jumpTo(camera(config.locations[index]));
      preloadNeighbours();
    });
    window.addEventListener('pagehide', event => { if (!event.persisted) { preloader.destroy(); viewer.destroy(); } });
  } catch (error) {
    clearTimeout(timeout);
    preloader.destroy();
    viewer?.destroy();
    fail();
    console.error('Homepage map failed to load', error);
  }
}
showLocation();
start();
