# Innovation Platform Website

## Develop locally:

Requirements:
- Node.js 22.12+ and npm
- git
- [Hugo](https://gohugo.io/installation/)

### Install the theme: 
From within the repo's root directory:

```shell
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
git submodule update --init --recursive
```
### Serve locally:

```shell
npm ci
npm run build:map
hugo serve
```
And navigate to http://localhost:1313/ to check your website. 


## Deploy

Just push your changes to the main branch, it will build automatically. 

## Public team preview

Run `bash scripts/build-preview.sh` with Hugo Extended 0.128.0 installed. Sign in at https://app.netlify.com/drop and drag the generated `preview/` folder into the drop zone. Share the resulting public URL. To update it, upload a fresh build in that same Netlify site's Deploys page. Delete the Netlify site when review is complete. This does not change the production website. Preview builds request no indexing; the URL is public.

## Homepage map

The homepage uses 3dtoml (pinned to the inspected sibling checkout's commit),
OpenFreeMap Liberty, and the Cesium LoD 2.2 tileset from the viewer manifest.
`data/home-map.json` contains the selected locations copied from
`../3dbag-viewer/src/assets/manifest.json`, plus zoom, pitch and colors. Terrain uses the same Terrarium DEM as the viewer:
`https://roofer-online.nl/mapterhorn-fork/tilejson.json`, with purple hillshading.
The arrows switch locations immediately. Drag with the left mouse button to rotate and tilt around the location. Scroll
zoom remains disabled so the map does not capture page scrolling. The configurable
`fieldOfView` defaults to 10 degrees for a near-orthographic view while keeping
the basemap, terrain and buildings aligned.

To highlight buildings, populate `highlights.values` with exact attribute values:

```json
"highlights": {
  "attribute": "identificatie",
  "values": ["NL.IMBAG.Pand.0503100000012345"],
  "color": "#563175"
}
```

The identifier above is illustrative; use identifiers present in the tileset.
For underpass data, set `tilesUrl` to the underpasses manifest's Cesium tileset,
`attribute` to `add_underpass_success`, and `values` to `[1]` (a number).
Attributes must exist in the tiles' structural metadata. Empty values give all
buildings their height-based color. 3dtoml already implements this coloring;
no changes to that repository are needed.

Hugo embeds `data/home-map.json` in the homepage, so location and configuration
edits take effect on Hugo reload without rebuilding JavaScript. After changing
map JavaScript, run `npm run build:map`. Generated assets
in `static/home-map/` are ignored by Git; the Pages workflow and `just` recipes
build them before Hugo. For local engine development, `npm install --no-save
../3dtoml` uses the sibling checkout; restore the pinned dependency with `npm ci`
before committing any lockfile changes.

### Roof-height shading and neighbour preload

`heightColors` controls ordered purple roof-height bands: below 8, 15, 25, 40,
and 60 metres above ground, then the darkest shade. The current v20250903 Cesium
tiles expose `b3_h_nok`, not `RF_H_ROOF_MAX`, so the homepage computes
`b3_h_nok - b3_h_maaiveld` before applying the bands. `groundAttribute` controls
the ground elevation field. Missing/invalid elevations and negative differences
use `buildingColor`.
Change the configured attribute if using a tileset that exposes `RF_H_ROOF_MAX`.
Missing/invalid heights use `buildingColor`; explicit `highlights` take priority.
The local `HomepageViewer` adapter supplies numeric conditions to 3dtoml's
existing semantic styling plugin.

After active tile downloads settle, the homepage prefetches up to six nearby
building tiles for each neighbouring location, using one low-priority request
at a time. The cache and each batch have a 24 MiB budget, individual files are
limited to 8 MiB, and navigation cancels stale work. Data-saving/2G connections
skip prefetching. The existing viewer consumes cached bytes through its
`fetchTiles` hook; tiles still need decoding/uploading on navigation. This warms
building tiles only, not OpenFreeMap or terrain tiles. Bounding-box traversal is
specific to the current explicit Cesium tileset hierarchy; unsupported bounding
volumes are skipped safely.

Run `npm test` for height-band, spatial selection and prefetch-cache checks.

Height category thresholds are fixed globally across every location; they do not
normalise to the currently visible buildings. The darkest category uses a lifted
purple to retain shading detail. Flat face normals, a fixed oblique key light,
a soft fill and neutral tone mapping keep roof/facade orientations visible while
orbiting, including in the darkest category.

Picking is disabled with `enablePicking: false`. “Open in 3DBAG” follows the
current camera, including orbit changes, using the matching language and
`basemap=openfreemap&lod=lod22`. Camera coordinates come from the engine's
`camera-change` event and are refreshed on click.
