## Prepare project structure
1. mkdir <project name>
1. mkdir <project name>/server
1. mkdir <project name>/client

## Setup Bitbucket
1. Create new repo on Bitbucket
1. Choose public or private repo access level

## Prepare Git
1. git init
1. Create a git ignore file .gitignore e.g. node_modules
1. git remote -v  (check on the current directory which remote is configured to)
1. To remove the git origin remote ( git remote remove origin)
1. add remote origin , git remote add origin <http git url>. e.g. git remote add origin https://kenken77@bitbucket.org/kenken77/fsf1703_day2.git

## Global Utility installation
1. npm install -g nodemon
1. npm install -g bower

## Prepare Express JS
1. npm init
1. npm install express --save

## How to start my app
1. Mac - export NODE_PORT=3000 or Windows - set NODE_PORT=3000
1. nodemon or nodemon server/app.js

## How to test my app
1. Launch Chrome , point to http://localhost:3000 or https://arcane-caverns-83264.herokuapp.com/

## Unit test your app
1. npm install --save-dev babel-cli babel-preset-env jest supertest superagent
1. Added the following scripts to the package.json "test": "jest"
1. npm test