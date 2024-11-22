# Innovation Platform Website

## Develop locally:

Requirements:
- git
- [Hugo](https://gohugo.io/installation/)

### Install the theme: 
From within the repo's root directory:

```shell
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
```
### Serve locally:

```shell
hugo serve
```
And navigate to http://localhost:1313/ to check your website. 


## Deploy

Just push your changes to the main branch, it will build automatically. 
