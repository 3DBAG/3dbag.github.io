# Common Hugo tasks for the 3DBAG website.

_default: help

# List available recipes.
help:
    @just --list

# Build the production site into public/.
build:
    npm run build:map
    hugo --minify --environment production

# Build a local preview into preview/ with search indexing disabled.
preview-build:
    bash scripts/build-preview.sh

# Run the production build locally at http://localhost:1313/.
preview:
    npm run build:map
    hugo server --environment production

# Run Hugo's development server, including drafts.
serve:
    npm run build:map
    hugo server --buildDrafts --buildFuture

# Remove generated site output.
clean:
    rm -rf public preview
