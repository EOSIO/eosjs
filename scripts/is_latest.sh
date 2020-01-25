is_latest=false;

current_commit="$(git rev-parse HEAD)";
tags="$(git tag --sort=-creatordate)";

IFS='\n' read -ra arry <<< "$tags"

latest_tag="${arry[0]}"

if [ "$latest_tag" == "" ]; then 
    latest_tag="v0.0.0";
else
    tag_commit="$(git rev-list -n 1 ${latest_tag})";
    if [ "$tag_commit" == "$current_commit" ]; then
        is_latest=true;
    fi
fi

echo "tag_commit: ${tag_commit}";
echo "current_commit: ${current_commit}";
echo "is_latest: ${is_latest}";

export TRAVIS_IS_LATEST_TAG="$is_latest"