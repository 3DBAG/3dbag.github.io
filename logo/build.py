"""Build the 3DBAG vector logo and PNG exports.

Requires fontTools and rsvg-convert; see README.md.
"""

from pathlib import Path
import argparse
import subprocess
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent
PALETTE = {
    "blue": "#2d5fc1",
    "cyan": "#24a1c8",
    "ice": "#b4dde6",
    "orange": "#c76327",
    "amber": "#ea8d23",
    "yellow": "#fdc409",
    "ink": "#333333",
}
WEBSITE = {
    "ink": "#32224b",
    "face": "#5d3d85",
    "roof": "#c8c1ce",
    "background": "#f8f7f3",
}


def block(x, y, height, colors):
    """One cuboid on a shared 30-degree isometric grid."""
    dx, dy = 32, 18.4752
    top = y - height
    points = [
        [(x - dx, top + dy), (x, top + 2 * dy), (x, y + 2 * dy), (x - dx, y + dy)],
        [(x, top + 2 * dy), (x + dx, top + dy), (x + dx, y + dy), (x, y + 2 * dy)],
        [(x, top), (x + dx, top + dy), (x, top + 2 * dy), (x - dx, top + dy)],
    ]
    return "\n".join(
        f'<path fill="{PALETTE[color]}" d="M' + " L".join(f"{px:g},{py:g}" for px, py in face) + ' Z"/>'
        for face, color in zip(points, colors)
    )


def underpass_block():
    """A raised blue volume with two outer square corner pillars.

    Each exterior wall and its pillar faces form a single continuous path,
    avoiding antialiasing seams at the joins. The inner pillar beside the
    middle building is omitted, leaving that side of the passage open.
    """
    return '''<g id="blue-underpass">
<path fill="#24a1c8" d="M36.8,121.72168 L41.6,118.9504 L41.6,142.9504 L36.8,145.72168 Z"/>
<path fill="#2d5fc1" d="M32,96.9504 L64,115.4256 L64,161.4256 L59.2,158.65432 L59.2,134.65432 L36.8,121.72168 L36.8,145.72168 L32,142.9504 Z"/>
<path fill="#24a1c8" d="M64,115.4256 L96,96.9504 L96,118.9504 L68.8,134.65432 L68.8,158.65432 L64,161.4256 Z"/>
<path fill="#b4dde6" d="M64,78.4752 L96,96.9504 L64,115.4256 L32,96.9504 Z"/>
</g>'''


def gabled_block():
    """The tall middle building, with an 18-unit gable roof rise."""
    return '''<g id="middle-blue-gable">
<path fill="#2d5fc1" d="M64,42.4752 L96,60.9504 L96,142.9504 L64,124.4752 Z"/>
<path fill="#24a1c8" d="M96,60.9504 L112,31.7128 L128,42.4752 L128,124.4752 L96,142.9504 Z"/>
<path fill="#24a1c8" d="M80,13.2376 L96,24 L128,42.4752 L112,31.7128 Z"/>
<path fill="#b4dde6" d="M64,42.4752 L80,13.2376 L112,31.7128 L96,60.9504 Z"/>
</g>'''


def icon():
    # One-third of the exposed middle wall, from the left roof to the eave.
    right_height = 46 + (82 - 46) / 3
    return '\n'.join([
        '<g id="buildings">',
        gabled_block(),
        underpass_block(),
        block(128, 124.4752, right_height, ("orange", "amber", "yellow")),
        '</g>',
    ])


def outlined_text(font_path, text, fill, size, x, y, tracking=0, element_id=None, fit_width=None):
    font = TTFont(font_path)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    advance = 0
    paths = []
    bounds = []
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        if pen.getCommands():
            paths.append(f'<path transform="translate({advance:g} 0)" d="{pen.getCommands()}"/>')
            if fit_width is not None:
                bounds_pen = BoundsPen(glyphs)
                glyphs[name].draw(bounds_pen)
                bounds.append((advance + bounds_pen.bounds[0], advance + bounds_pen.bounds[2]))
        advance += glyphs[name].width + tracking
    if fit_width is not None:
        left = min(bound[0] for bound in bounds)
        right = max(bound[1] for bound in bounds)
        scale = fit_width / (right - left)
        x -= left * scale
    id_attribute = f' id="{element_id}"' if element_id else ''
    return f'<g{id_attribute} fill="{fill}" transform="translate({x:.9g} {y:.9g}) scale({scale:.9g} {-scale:.9g})">' + ''.join(paths) + '</g>'


def wordmark(font_path, fill):
    return outlined_text(font_path, '3DBAG', fill, 62, 140, 90, tracking=12, element_id='wordmark')


def slab():
    """A square slab around the buildings' full footprint, with an 8-unit edge.

    The footprint covers two grid cells on each axis. An extra .12 cell on
    every side adds a small margin. A solid underfill prevents edge seams.
    """
    return '''<g id="square-platform">
<path fill="#8e7ba6" d="M96,101.565952 L167.68,142.9504 L167.68,150.9504 L96,192.334848 L24.32,150.9504 L24.32,142.9504 Z"/>
<path fill="#b4a6c5" d="M167.68,142.9504 L167.68,150.9504 L96,192.334848 L96,184.334848 Z"/>
<path fill="#e3dfe9" d="M96,101.565952 L167.68,142.9504 L96,184.334848 L24.32,142.9504 Z"/>
</g>'''


def website_variants(symbol, font_path, tagline_font, with_slab=False):
    purple = symbol
    for source, target in [
        ('blue', 'ink'), ('cyan', 'face'), ('ice', 'roof'),
        ('orange', 'ink'), ('amber', 'face'), ('yellow', 'roof'),
    ]:
        purple = purple.replace(PALETTE[source], WEBSITE[target])
    variants = {}
    if with_slab:
        purple = slab() + purple
        icon_group = '<g transform="translate(-7 -4) scale(.85)">' + purple + '</g>'
    else:
        icon_group = '<g transform="translate(-12 -2) scale(.9)">' + purple + '</g>'
    prefix = '3dbag-platform-slab' if with_slab else '3dbag-platform'
    height = 180 if with_slab else 160
    baseline = 90 if with_slab else 78
    for language, tagline in [('nl', 'Innovatie Platform'), ('en', 'Innovation Platform')]:
        stacked = icon_group
        # Match the actual outlines' left and right edges, preserving glyph
        # proportions by adjusting font size rather than stretching letters.
        stacked += outlined_text(font_path, '3DBAG', WEBSITE['ink'], 68, 153, baseline, tracking=12, fit_width=210)
        stacked += outlined_text(tagline_font, tagline, WEBSITE['ink'], 23.5, 153, baseline + 32, fit_width=210)
        variants[f'{prefix}-stacked-{language}'] = (380, height, stacked, f'3DBAG {tagline}')
        # Preserve existing file links while moving every tagline below.
        variants[f'{prefix}-horizontal-{language}'] = variants[f'{prefix}-stacked-{language}']
    suffix = 'purple-slab' if with_slab else 'purple'
    variants[f'3dbag-icon-{suffix}'] = (192, 208 if with_slab else 192, purple, '3DBAG purple building icon')
    variants[f'3dbag-logo-{suffix}'] = (322, 164 if with_slab else 140,
        '<g transform="translate(-10 -5) scale(.8)">' + purple + '</g>' + wordmark(font_path, WEBSITE['ink']),
        '3DBAG purple logo')
    return variants


def svg(width, height, body, label):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">
<title id="title">{escape(label)}</title>
{body}
</svg>
'''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--font', type=Path, default=Path.home() / 'Library/Fonts/Barlow-SemiBold.ttf')
    parser.add_argument('--tagline-font', type=Path, default=Path.home() / 'Library/Fonts/Barlow-Regular.ttf')
    parser.add_argument('--renderer', default='rsvg-convert')
    args = parser.parse_args()
    assets = ROOT / 'assets'
    assets.mkdir(exist_ok=True)
    symbol = icon()
    lockup = '<g transform="translate(-10 -5) scale(.8)">' + symbol + '</g>'
    dark = lockup + wordmark(args.font, PALETTE['ink'])
    reverse = lockup + wordmark(args.font, '#ffffff')
    files = {
        '3dbag-icon': svg(192, 192, symbol, '3DBAG — isometric buildings with a gabled roof and underpass'),
        '3dbag-logo': svg(322, 140, dark, '3DBAG'),
        '3dbag-logo-reversed': svg(322, 140, reverse, '3DBAG'),
    }
    for name, source in files.items():
        path = assets / f'{name}.svg'
        path.write_text(source)
        subprocess.run([args.renderer, '-w', '1288' if 'logo' in name else '768', '-o', str(assets / f'{name}.png'), str(path)], check=True)

    # A single presentation image keeps the logo, alternate background and
    # actual header-size example together for review.
    preview = f'''<rect width="1200" height="800" fill="#f4f5f6"/>
<rect x="48" y="48" width="1104" height="408" rx="16" fill="#ffffff"/>
<g transform="translate(225 99) scale(2.25)">{dark}</g>
<rect x="48" y="480" width="660" height="272" rx="16" fill="#242c35"/>
<g transform="translate(100 507) scale(1.65)">{reverse}</g>
<rect x="732" y="480" width="420" height="272" rx="16" fill="#ffffff"/>
<g transform="translate(849 515) scale(.97)">{symbol}</g>
<g transform="translate(886 696) scale(.34)">{dark}</g>'''
    path = ROOT / 'preview.svg'
    path.write_text(svg(1200, 800, preview, '3DBAG logo preview: primary logo, dark background and compact icon'))
    subprocess.run([args.renderer, '-o', str(ROOT / 'preview.png'), str(path)], check=True)

    variants = website_variants(symbol, args.font, args.tagline_font)
    variants.update(website_variants(symbol, args.font, args.tagline_font, with_slab=True))
    for name, (width, height, body, label) in variants.items():
        path = assets / f'{name}.svg'
        path.write_text(svg(width, height, body, label))
        subprocess.run([args.renderer, '-w', str(width * 4), '-o', str(assets / f'{name}.png'), str(path)], check=True)

    stacked = variants['3dbag-platform-stacked-nl'][2]
    english = variants['3dbag-platform-stacked-en'][2]
    ink, paper, rule = WEBSITE['ink'], WEBSITE['background'], WEBSITE['roof']
    website_preview = f'''<rect width="1200" height="780" fill="{paper}"/>
<g transform="translate(68 30) scale(1.65)">{stacked}</g>
<path d="M48,318 H1152" stroke="{rule}"/>
<g transform="translate(68 352) scale(1.65)">{english}</g>
<path d="M48,638 H1152" stroke="{rule}"/>
<g transform="translate(68 663) scale(.55)">{stacked}</g>
<g transform="translate(448 663) scale(.55)">{english}</g>'''
    path = ROOT / 'preview-platform.svg'
    path.write_text(svg(1200, 780, website_preview, 'Purple platform logos: Dutch and English taglines below 3DBAG, with header-size examples'))
    subprocess.run([args.renderer, '-o', str(ROOT / 'preview-platform.png'), str(path)], check=True)

    slab_stacked = variants['3dbag-platform-slab-stacked-nl'][2]
    slab_english = variants['3dbag-platform-slab-stacked-en'][2]
    slab_preview = f'''<rect width="1200" height="940" fill="{paper}"/>
<g transform="translate(68 30) scale(1.65)">{slab_stacked}</g>
<path d="M48,350 H1152" stroke="{rule}"/>
<g transform="translate(68 378) scale(1.65)">{slab_english}</g>
<path d="M48,702 H1152" stroke="{rule}"/>
<g transform="translate(68 736) scale(.75)">{slab_stacked}</g>
<g transform="translate(448 736) scale(.75)">{slab_english}</g>'''
    path = ROOT / 'preview-platform-slab.svg'
    path.write_text(svg(1200, 940, slab_preview, 'Purple platform logos with a square base slab and equal-width stacked lettering'))
    subprocess.run([args.renderer, '-o', str(ROOT / 'preview-platform-slab.png'), str(path)], check=True)


if __name__ == '__main__':
    main()
