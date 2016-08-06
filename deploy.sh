#!/bin/bash
# Deploy build product to GitHub pages:

# Record this for commit message on `gh-pages` branch later for reference.
# Remember, we're still in the main repo)
rev=$(git rev-parse --short HEAD)

# Essentially, in the next few steps, we will `diff` the newly created built
# content against that of the previous build on the `gh-pages` branch in order
# to create a patch which will take us from the previous build to the current
# build.
cd dist

git init
# these variables are encrypted by Travis.
git config user.name "$GH_USER_NAME"
git config user.email "$GH_USER_EMAIL"

git remote add upstream "git@github.com:huy-nguyen/restaurant-menu-builder.git"
git fetch upstream
git reset upstream/gh-pages

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
