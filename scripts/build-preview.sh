#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
"${HUGO_BIN:-hugo}" --environment preview --config hugo.toml,preview.toml --destination preview --cleanDestinationDir
printf 'User-agent: *\nDisallow: /\n' > preview/robots.txt
printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > preview/_headers
printf 'Upload the preview/ folder at https://app.netlify.com/drop\n'
