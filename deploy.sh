#!/bin/bash
echo "DoUHave Deployer"
echo "------------------------------------"
echo
oldVersion=$(<version.txt)
read -p "Version is $oldVersion | Did you need to update the version? (Y/N): " updateVersion
if [[ $updateVersion == [yY] || $updateVersion == [yY][eE][sS] ]]; then
    read -p "Enter new version: " version
    if [ ${#version} -ge 5 ]; then
        rm -f version.txt
        echo "$version" >> version.txt
    else
        echo "Not a valid version number"
        exit 1
    fi
fi

branch=$(git symbolic-ref --short HEAD)
read -p "The best practice is to commit before deploying. Do a commit now? " doCommit
[[ $doCommit == [yY] || $doCommit == [yY][eE][sS] ]] && read -p "Please enter a message for the commit: " message
if [[ $doCommit == [yY] || $doCommit == [yY][eE][sS] ]] 
then
    git add .
    git commit -m "$message"
    git push origin $branch
fi

ebenv=duh-${branch}-server-env
commit=$(git rev-parse --short=7 HEAD)
message=$(git log -1 --pretty=format:"%s")
echo "Environment:    $ebenv"
echo "Current Branch: $branch"
echo "Current Commit: $commit - $message"
echo "--------"
echo "About to execute: eb deploy $ebenv -l \"${branch////_} - $commit\" -m \"$message\""
read -p "Are you ready to deploy? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
~/.aws/mfa
eb deploy $ebenv -l "${branch////_} - $commit" -m "$message"
# CloudFront invalidations
# please add text files with cf_dist prefix to make this work
cf_dist=$(<cf_dist_$branch)
if [ ${#cf_dist} -ge 10 ]; then
    echo "Invalidating CloudFront Distribution $cf_dist" 
    aws cloudfront create-invalidation --distribution-id $cf_dist --paths "/*"
else
    echo "Did not find a CloudFront distribution, could not invalidate"
fi

echo "Completed deployment."