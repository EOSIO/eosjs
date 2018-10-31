
#!/bin/sh

setup_git() {
  # Set the user name and email to match the API token holder
  # This will make sure the git commits will have the correct photo
  # and the user gets the credit for a checkin
  git config --global user.email "devops@block.one"
  git config --global user.name "blockone-devops"
  git config --global push.default matching
  
  # Get the credentials from a file
  git config credential.helper "store --file=.git/credentials"
  
  # This associates the API Key with the account
  echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials
}

make_version() {
  # Make sure that the workspace is clean
  # It could be "dirty" if
  # 1. package-lock.json is not aligned with package.json
  # 2. npm install is run
  git checkout -- .
  
  # Echo the status to the log so that we can see it is OK
  git status
  
  # Run the deploy build and increment the package versions
  # %s is the placeholder for the created tag
  npm version -no-git-tag-version $TRAVIS_TAG
}

upload_files() {
  git commit -a -m "Updating version [skip ci]"

  # This make sure the current work area is pushed to the tip of the current branch
  git push origin HEAD:master  
}

echo "Running on tag ${TRAVIS_TAG}, branch ${TRAVIS_BRANCH}":

echo "Setting up git"
setup_git

echo "Creating new version"

make_version

echo "Pushing to git"
upload_files

echo "Build and Publish to NPM"

cp .npmrc.template $HOME/.npmrc 

npm publish