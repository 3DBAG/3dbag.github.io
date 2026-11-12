# Innovation Platform Website

## Develop locally:

Requirements:
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
hugo serve
```
And navigate to http://localhost:1313/ to check your website. 


## Deploy

Just push your changes to the main branch, it will build automatically. 

## Public team preview

Run `bash scripts/build-preview.sh` with Hugo Extended 0.128.0 installed. Sign in at https://app.netlify.com/drop and drag the generated `preview/` folder into the drop zone. Share the resulting public URL. To update it, upload a fresh build in that same Netlify site's Deploys page. Delete the Netlify site when review is complete. This does not change the production website. Preview builds request no indexing; the URL is public.
