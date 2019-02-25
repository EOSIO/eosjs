#!/bin/bash

. "${TRAVIS_BUILD_DIR}/scripts/publish-utils.sh";

echo "Running on branch/tag ${TRAVIS_BRANCH}":

echo "Setting up git"
setup_git

echo "Creating new version"
git checkout -- .

git status

npm version prerelease -preid "${TRAVIS_BUILD_NUMBER}" -no-git-tag-version

git commit -a -m "Updating version [skip ci]"

echo "Publish to NPM"

cp .npmrc.template $HOME/.npmrc

npm publish --tag edge
